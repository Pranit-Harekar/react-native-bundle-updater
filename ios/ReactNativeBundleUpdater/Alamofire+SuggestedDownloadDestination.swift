//
//  Alamofire+SuggestedDownloadDestination.swift
//  ReactNativeBundleUpdater
//
//  Created by Pranit  Harekar on 4/21/19.
//  Copyright © 2019 Pranit Harekar. All rights reserved.
//

import Foundation
import Alamofire

extension Alamofire.DownloadRequest {
    open class func suggestedDownloadDestination(
        for directory: FileManager.SearchPathDirectory = .documentDirectory,
        in domain: FileManager.SearchPathDomainMask = .userDomainMask,
        with options: DownloadOptions)
        -> DownloadFileDestination
    {
        return { temporaryURL, response in
            let destination = DownloadRequest.suggestedDownloadDestination(for: directory, in: domain)(temporaryURL, response)
            return (destination.destinationURL, options)
        }
    }
}

