// ---------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ---------------------------------------------------------------------------

import React, { MutableRefObject } from 'react';
import { Report, Page } from 'powerbi-client';
import { decode } from 'jsonwebtoken';
import { storageKeyJWT, tokenExpiryKey } from './constants';
import {
	Bookmark,
	TabConfig,
	DateFormat,
	OpportunityTablePowerBIData,
	LeadTablePowerBIData,
	PreFilledValues,
} from './models';

/**
 * Gets current active page from the given report
 * @param powerbiReport
 * @returns active page instance
 */
export async function getActivePage(powerbiReport: Report): Promise<Page|unknown> {
	const pages = await powerbiReport.getPages();

	// Find active page
	const activePage = pages.find((page) => {
		return page.isActive;
	});

     // if (activePage) {
     //      return activePage;
     // }

	return activePage;
}

/**
 * Returns true when the given token is currently active (not expired), false otherwise
 * @param jwt Token
 */
 export function checkTokenValidity(jwt: string): boolean {
	// JWT token not present
	if (!jwt) {
		return false;
	}

	// Get token expiry property from token payload
	const tokenExpiryString = getTokenPayloadProperty(jwt, tokenExpiryKey);

	// Expiry time not found on the token payload
	if (!tokenExpiryString) {
		return false;
	}

	// Convert to number
	const tokenExpiry: number = +tokenExpiryString;

	// Check if token expiry property is not a number
	if (Number.isNaN(tokenExpiry)) {
		return false;
	}

	// Convert to milliseconds
	const tokenExpiryMS = tokenExpiry * 1000;

	// Check if token is expired
	return Date.now() <= tokenExpiryMS;
}


/**
 * Returns the report page name of the specified tab
 * @param tabName
 * @param tabConfig
 */
 export function getPageName(tabName: string, tabConfig: TabConfig[]): string|null {
	const tab = tabConfig.find((tabs) => {
		return tabs.name === tabName;
	});
     if (tab){
          return tab.reportPageName;
     } else {
          return null;
     }
}

/**
 * Returns stored jwt token from session storage or null when no token found
 */
 export function getStoredToken(): string | null {
	const storageValueJWT = sessionStorage.getItem(storageKeyJWT);

	return storageValueJWT;
}


/**
 * Downloads the file in the JSON object
 * @param fileData file JSON object
 */
 export function downloadFile(fileData: { [key: string]: string }): void {
	console.info('Starting download process');

	try {
		// Create blob for file contents of given content type
		const blob = new Blob([base64ToArrayBuffer(fileData.fileContents)], {
			type: fileData.contentType,
		});

		// Creating an object URL
		const URL = window.URL || window.webkitURL;
		const dataUrl = URL.createObjectURL(blob);

		// Downloading the file using the object URL by using anchor element
		const element = document.createElement('a');
		element.setAttribute('class', 'download-anchor');
		element.setAttribute('href', dataUrl);
		element.setAttribute('download', fileData.fileDownloadName);
		document.body.appendChild(element);
		element.click();

		// Deleting the object URL and anchor element
		document.body.removeChild(element);
		URL.revokeObjectURL(dataUrl);
	} catch (error) {
          if (error) {
               console.error('Error downloading file', error);
          }
	}
}

/**
 * Returns the given property value in token payload if it exists, null otherwise
 * @param jwt Token
 */
export function getTokenPayloadProperty(jwt: string, property: string): string | null {
	// JWT token not present
	if (!jwt) {
		return null;
	}
     let tokenPayload = getTokenPayload(jwt)
     if (!tokenPayload) {
	     return null;
     }
     const decodedPayloadObject: Record<string, string> = tokenPayload;

	// Return null if decodedPayloadObject or given property in decodedPayloadObject does not exists
	if (!decodedPayloadObject || !(property in decodedPayloadObject)) {
		return null;
	}

	// Return the given property value
	return decodedPayloadObject[property];
}

/**
 * Returns the decoded object of payload/claim of the given token
 * @param jwt Token
 */
export function getTokenPayload(jwt: string): { [key: string]: string }|null {
	// JWT token not present
	if (!jwt) {
		return null;
	}

	return decode(jwt, { json: true });
}

/**
 * Converts base64 string to Uint8Array array
 * @param base64 string
 */
 export function base64ToArrayBuffer(base64: string): Uint8Array {
	const binaryString = window.atob(base64);
	const binaryLen = binaryString.length;
	const bytes = new Uint8Array(binaryLen);

	for (let idx = 0; idx < binaryLen; idx++) {
		const ascii = binaryString.charCodeAt(idx);
		bytes[idx] = ascii;
	}

	return bytes;
}