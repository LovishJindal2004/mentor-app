import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { JsonPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookiesService } from './cookies';
import { environment } from 'environment/environment';


@Injectable({ providedIn: 'root' })
export class DataGuardService {
    keySize = 256;
    ivSize = 128;
    iterations = 100;
    passcode: string;
    openSnackBar(message: string, action: string) {
        this._matSnockbar.open(message, action, {
            duration: 2000,
        });
    }
    constructor(
        private router: Router,
        private _matSnockbar: MatSnackBar,
        private _cookiesService: CookiesService
    ) {
        this.passcode = environment.OAuthConfiguration.ApiPassword;
    }

    public valueEncryption(data: any) {
        try {
            var salt = CryptoJS.lib.WordArray.random(128 / 8);

            var key = CryptoJS.PBKDF2(this.passcode, salt, {
                keySize: this.keySize / 32,
                iterations: this.iterations
            });

            var iv = CryptoJS.lib.WordArray.random(128 / 8);

            var encrypted = CryptoJS.AES.encrypt(data.toString(), key, {
                iv: iv,
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC

            });

            var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
            return data;
        }
        catch (e) {
            return null;
        }

    }

    public valueDecryption(data: any) {
        try {
            var salt = CryptoJS.enc.Hex.parse(data.substr(0, 32));
            var iv = CryptoJS.enc.Hex.parse(data.substr(32, 32))
            var encrypted = data.substring(64);

            var key = CryptoJS.PBKDF2(this.passcode, salt, {
                keySize: this.keySize / 32,
                iterations: this.iterations
            });

            var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
                iv: iv,
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC

            })
            //return decrypted.toString(CryptoJS.enc.Utf8);
            return data;
        }
        catch (e) {
            return null;
        }
    }

    public encryption(data: any) {
        try {
            return CryptoJS.AES.encrypt(data, this.passcode).toString();
        }
        catch (e) {
            return null;
        }

    }

    public decryption(data: any) {
        try {
            return CryptoJS.AES.decrypt(data, this.passcode).toString(CryptoJS.enc.Utf8);
        }
        catch (e) {
            return null;
        }
    }

    getLocalData(key: string) {
        return localStorage.getItem(key);
    }

    setLocalData(key: string, data: any) {
        return localStorage.setItem(key, data);
    }
    getLocalExamData(key: string) {
        return this.decryption(localStorage.getItem(key));
    }

    setLocalExamData(key: string, data: any) {
        return localStorage.setItem(key, this.encryption(data));
    }
    setCourseId(key: string, data: any) {
        return localStorage.setItem(key, this.encryption(data));
    }
    getCourseId(key: string='Courseid') {
        return this.decryption(localStorage.getItem(key));
    }
    removeLocalData(key: string) {
        return localStorage.removeItem(key);
    }

    getCookieData(key: string) {
        return this.decryption(this._cookiesService.getCookie(key));
    }

    setCookieData(key: string, data: any) {
        return this._cookiesService.setCookie(key, this.encryption(data), 10, '/');
    }

    removeCookieData(key: string) {
        return this._cookiesService.deleteCookie(key);
    }

    getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return;
                }
                seen.add(value);
            }
            return value;
        };
    };
}