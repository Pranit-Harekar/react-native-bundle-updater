import { NativeModules, NativeEventEmitter } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import semver from 'semver'

const nativeModule = NativeModules.BundleUpdater
const nativeEventEmitter = new NativeEventEmitter(NativeModules.BundleUpdater)

export type IUpdateCheckFrequency = 'ON_APP_START' | 'ON_APP_RESUME' | 'MANUAL'
export type IDownloadMode = 'ON_APP_RESTART' | 'ON_APP_RESUME' | 'ON_APP_SUSPEND' | 'IMMEDIATE'
export type ISyncState = 'CHECKING_FOR_UPDATE' | 'DOWNLOADING_UPDATE' | 'UP_TO_DATE' | 'UNKNOWN'

export interface IMetadata {
  version: string
  minContainerVersion: string
  remoteMetadataUrl: string
  remoteBundleUrl: string
  releaseNotes?: string
  isMandatory?: boolean
}

export default class ReactNativeBundleUpdater {
  public constructor(
    public metadata: IMetadata,
    public checkFrequency: IUpdateCheckFrequency,
    public downloadMode: IDownloadMode,
    public useCellularData = false,
    public showProgress = true,
    public showUpdateDialog = true,
    private syncState: ISyncState = 'UP_TO_DATE',
  ) {
    this.setMetadata('metadata', metadata)
    switch (this.checkFrequency) {
      case 'ON_APP_START':
        nativeEventEmitter.addListener('APP_STARTED', this.sync)
        break
      case 'ON_APP_RESUME':
        nativeEventEmitter.addListener('APP_RESUMED', this.sync)
        break
      default:
        break
    }
    // Note: If checkFrequency is set to MANUAL then developer is
    // responsible to invoke the `sync` function
  }

  // stores metadata in the async storage
  private setMetadata = async (key: string, metadata: IMetadata) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(metadata))
    } catch (e) {
      // TODO: Should we do better than this?
      console.error(e)
    }
  }

  // gets metadata from the async storage
  private getMetadata = async (key: string) => {
    const str = await AsyncStorage.getItem(key)
    if (!str) {
      throw new Error(
        `Failed to get ${key} from AsyncStorage. You should never end up in this situation`,
      )
    }
    return JSON.parse(str) as IMetadata
  }

  // kicks off sync process
  public sync() {
    if (this.syncState !== 'CHECKING_FOR_UPDATE' && this.syncState !== 'DOWNLOADING_UPDATE') {
      this.checkAndDownloadUpdate()
    }
    console.log(`Sync is already in progress. SyncState: ${this.syncState}`)
  }

  private checkAndDownloadUpdate = async (): Promise<void> => {
    this.syncState = 'CHECKING_FOR_UPDATE'
    var downloadMode = this.downloadMode

    try {
      const updateAvailable = await this.checkForUpdate()
      if (updateAvailable) {
        const mandatory = await this.isMandatoryUpdate()
        if (mandatory) {
          downloadMode = 'IMMEDIATE'
        }

        switch (downloadMode) {
          case 'ON_APP_RESTART':
            nativeEventEmitter.once('APP_STARTED', this.downloadAndApplyUpdate, null)
            break
          case 'ON_APP_RESUME':
            nativeEventEmitter.once('APP_RESUMED', this.downloadAndApplyUpdate, null)
            break
          case 'ON_APP_SUSPEND':
            nativeEventEmitter.once('APP_SUSPENDED', this.downloadAndApplyUpdate, null)
            break
          default:
            // IMMEDIATE
            this.downloadAndApplyUpdate()
        }
      }
      this.syncState = 'UP_TO_DATE'
    } catch (e) {
      console.error(e)
      this.syncState = 'UNKNOWN'
    }
  }

  // get remoteMetadataUrl from async storage and download metadata
  // if the metadata contains greater bundle version then update the
  // local metadata copy in async storage and return true otherwise false
  private checkForUpdate = async (): Promise<boolean> => {
    const metadata = await this.getMetadata('metadata')
    const newMetadata = (await nativeModule.downloadMetadata(
      metadata.remoteMetadataUrl,
    )) as IMetadata // TODO: validate metadata instead of just force casting

    const result = semver.gt(newMetadata.version, metadata.version)
    if (result) {
      this.setMetadata('metadata', newMetadata)
      this.setMetadata('prev-metadata', metadata)
    }
    return result
  }

  // checks if isMandatory field is set in metadata
  private isMandatoryUpdate = async (): Promise<boolean> => {
    const metadata = await this.getMetadata('metadata')
    return metadata.isMandatory != null && metadata.isMandatory
  }

  private downloadAndApplyUpdate = async () => {
    if (this.showUpdateDialog) {
      // render dialog component
      // TODO: Add logic to take customer's consent to download and apply update.
      // For now let's just assume that customer consented to continue
    }
    this.syncState = 'DOWNLOADING_UPDATE'
    await this.downloadUpdate()
    this.applyUpdate()
  }

  // call native module that will relaunch app
  private applyUpdate = (): void => {
    return nativeModule.relaunchApp()
  }

  // call native module that downloads the bundle from remoteBundleUrl
  // and saves it on disk
  private downloadUpdate = async (): Promise<void> => {
    const metadata = await this.getMetadata('metadata')
    return nativeModule.downloadUpdate(
      metadata.remoteBundleUrl,
      this.useCellularData,
      this.showProgress,
    )
  }
}
