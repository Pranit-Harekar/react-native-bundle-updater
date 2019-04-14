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
    let JSCodeLocation = Bundle.main.url(forResource: "main", withExtension: "jsbundle")!
    
    //    MARK:- For now lets just assume that main.jsbundle is located in the main application bundle
    //    func initialize(withCustomJSCodeLocation newJSCodeLocation: URL) {
    //        self.JSCodeLocation = newJSCodeLocation
    //    }
    
    @objc func downloadUpdate(url: String, useCellularData: Bool, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        // TODO:- Implement download logic
    }
    
    @objc func applyUpdate() {
        // TODO:- Implement apply update and relaunch app logic
    }
}
