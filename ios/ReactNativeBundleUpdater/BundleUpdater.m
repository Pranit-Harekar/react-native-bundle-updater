//
//  BundleUpdater.m
//  ReactNativeBundleUpdater
//
//  Created by Pranit  Harekar on 4/14/19.
//  Copyright © 2019 Pranit Harekar. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(BundleUpdater, NSObject)
RCT_EXTERN_METHOD(downloadUpdate: (NSString *)url useCellularData:(BOOL *)useCellularData showProgress:(BOOL *) showProgress resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(applyUpdate)
@end

