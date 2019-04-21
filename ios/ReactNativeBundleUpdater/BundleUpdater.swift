//
//  BundleUpdater.swift
//  ReactNativeBundleUpdater
//
//  Created by Pranit  Harekar on 4/14/19.
//  Copyright © 2019 Pranit Harekar. All rights reserved.
//

import Foundation
import Alamofire

@objc(BundleUpdater)
class BundleUpdater: NSObject {
    static let sharedInstance = BundleUpdater()
    var bundleURL = Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    var fileURL: URL?
    
    //Initializer access level change now
    private override init() {
        super.init()
    }
    
    @objc func downloadUpdate(url: String, useCellularData: Bool, showProgress: Bool, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let destination = DownloadRequest.suggestedDownloadDestination(for: .cachesDirectory,
                                                                       in: .userDomainMask,
                                                                       with: [.removePreviousFile])
        
        Alamofire.download(url, to: destination).response { response in
            if let downloadError = response.error {
                let errorMessage = "Error downloading bundle: \(String(describing: downloadError))"
                reject(nil, errorMessage, nil)
            } else {
                self.bundleURL = response.destinationURL!
                resolve(nil)
            }
        }
    }
    
    
    @objc func downloadMetadata(url: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let destination = DownloadRequest.suggestedDownloadDestination(for: .cachesDirectory,
                                                                       in: .userDomainMask,
                                                                       with: [.removePreviousFile])
        
        Alamofire.download(url, to: destination).response { response in
            if let downloadError = response.error {
                let errorMessage = "Error downloading metadata: \(String(describing: downloadError))"
                reject(nil, errorMessage, nil)
            } else {
                self.fileURL = response.destinationURL!
            }
        }
        
        do {
            let data = try Data(contentsOf: self.fileURL!, options: .mappedIfSafe)
            let jsonResult = try JSONSerialization.jsonObject(with: data, options: .mutableLeaves) as! Dictionary<String, String>
            resolve(jsonResult)
        } catch {
            reject(nil, error.localizedDescription, error)
        }
    }
}
