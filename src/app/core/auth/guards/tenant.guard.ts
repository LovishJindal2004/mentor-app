import { Inject, Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { tenantDetails } from 'app/core/tenantModels';
import { helperService } from '../helper';
import { DOCUMENT } from '@angular/common';
import { environment } from 'environment/environment';
import { CommanService } from 'app/modules/common/services/common.service';
import { appConfig } from '../app.config';
@Injectable({
  providedIn: 'root'
})
export class tenantGuard implements CanActivate {
  tenantDetails: any;
  domainName: any;
  _env: any;
  keyName = appConfig.localStorageName.TenantInfoStorageName;
  private secretKey = this._encryptionService.getSecretKey();
  constructor(private authservice: AuthService, private route: Router, private _encryptionService: helperService, private _commanService: CommanService, @Inject(DOCUMENT) private document: Document,private _ngZone:NgZone) {
    this.domainName = this.document.location.hostname;
  
    var self = this;
    self._env = environment;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.tenantValidate().pipe(
      tap((isValid) => {
        if (!isValid) {
          this._ngZone.run(() => {
            this.route.navigate(['tenant-not-found']);
          });
        }
      })
    );
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.tenantValidate().pipe(
      tap((isValid) => {
        if (!isValid) {
          this._ngZone.run(() => {
            this.route.navigate(['tenant-not-found']);
          });
        }
      })
    );
  }

  tenantValidate(): Observable<boolean> {
    let tenantData = localStorage.getItem(this.keyName);

   if(localStorage.getItem("tenantInfoRemoved")!="true")
    {
      tenantData=null;
      localStorage.setItem('tenantInfoRemoved', 'true');
    }
    
    if (tenantData == null) {
      // return this.authservice.GetTinatDetail(this._env.tenantname).pipe(
        // map((res: any) => {
          this.tenantDetails = {
            "SubDomain": "kfmsr",
            "FirstName": "kfmsr",
            "LastName": "kfmsr",
            "FullName": null,
            "CollegeName": "kfmsr",
            "Email": "kfmsr@gmail.com",
            "Banner1": null,
            "PostBanner1": null,
            "Banner2": null,
            "PostBanner2": null,
            "StateId": 23,
            "Logo": "iVBORw0KGgoAAAANSUhEUgAAAHgAAABsCAYAAAChI3ZfAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAMOlJREFUeJztfQeAVcX197RbX92+wNI7CEgVQUA6WNCIXZMYW6LyN8Ykmqgxn9EYNYkaoyZRscWOGkVFqkhVqg1QQGBhF9jCtlduvzPfzH27CIIRll1aOPp4b++dO/fe+c2cOefMOWcIOEHHNZEj/QAnqHnpBMDHOZ0A+Din4wbgG7p2wm06KNFOXUMt8wv1zhKROisKyVVkHFc0KabpUhghij2P+Z7LbNfzHcfCqXTa25BKWatLt6a2Fm8yKsp2OOnHN6zzj/T7NBUdNwCfoP3TMQnwpe0GwdNHxrN69gS98/LM/hIxe8oYnxzSYQdZrpMgKkEQ+BAxCTKGIUM+BNADAFIIGGSAYYCBy2tCjAJMKQtROjDCbFs1DBN/eSvrv86yQ2srdoY+XvcJ+vKn095LHel3biwdMwBfUNQaXnddl06F+XBoKGKepmgVvRTFKJKRGUXA4e8BJQAxhhw/AGhwDQUOgPybo8r/ZZmK+HnIwaYA8T98ftTn512AcQLoBGm67g8GAA/0gebkF8g1XborX0/4wdCVNTXa4uKtzuq3Xqspe7b4C3qEmuGg6agH+MkfT9RO6pkcXFREz9UjZafJcrqIQC/EQZP5iCR8ZEIGaQAiEnCy+g/MQBoM2OAPHNQXAIrEuBVXCLAz4DPxhagoKDFAJQSoqiAzLEusBb/vwEiudllh65xtffrkfnh16YhpX3yhrbvuhZnOkWybA6GjEuC7hp+KRo6OdmrbCpwfytk1TFbqOhNs5EJIQxD6mI9CjgvMjEYBo8CFM13GP5SpwKcKl6FQijJgMA/x4co/DHLBiVGEoc55N2bQ44gzhRAWwsiTELQhr5vXJ4qKASrgp4iDLhMGZRm4EV2pzI/IVd3icfXsDh2iq4YMGP3m1p104aT759cd6Tb7LjqqAH7iJ6ejHj1jRQX5NRfmZm09T8Hp9hD7cYA9RUyeiIMKxVDj3wJTj8m+74fTnhPeZdt4m+PY610HbkJI2waRV05kO8FnWx/4mSsFaBDxGjl/tj0sUZ+ohChZvmcXQOi2kWXSQVZwZ0lJF0lyKosgR0bU5zO1GN4+5P1EBsjLVrEZU1G6baxT7ZCWbbLWrnlq7Fvlu6SZb7yxrfLxFWvYkW7HPemoAHjuXROwpvktWrY0J0TCpRcpamU3gt1ChjwSgMIEx0WcuSrMp8T0XLnC9dT1tks+d1z0GWRKMR+MdWlDStXVgJRl5prlO5G9ZFGZX1ELwLSdS3c3+qTcgTArGgKtW8iwfVsVdewckpC0S9F1U4tGpZDPQKQuzVrIktZLlfzesmz1JJLdDhMzgqCDAo4OOb+X3CgmXiRErKIitaZnTk7WhMLr8547fd2YBRf+ea515FpzbzriAC97aGw4FHXG5WTXXBxWUn0laLVFxJCEEAQZZ5lMYBwChhkqMV2yxLbBMj4a1yOo70wZoaodO72aDz7YZtw7/+sDEnym71rBwC7+YzPvOUsCaYyL18Dkn9qGMi/9fOi6rp3CK3PiTrbtoDyA1B6ERE9XZWeophitEUpn5nZkQ4wsXfPdzhKkLeXC2i6q1uKdd+8Y90/fBxXn/Gn2ER/NRwzgxy4cjwedytq1KrKu1vWyiRIxOmPs6mJOpfWCEfNjwDJCXziONMd1laWGI63fUS6VbdqI666eOsdtrme79G9LbP5VIT53jBy94Ywz5C9yc+0lnmJ0tW15gCTrwxXJ6kPkZIjx/sGFNkhgKswfvq8cdQrDA3K711TFX3zvthHzzrx3gdFcz3kgdEQA/vDes0L5ualT8nITVyt6chTBVgGGZnBOCEoeDVPTCq9zLP0911EXV1eTNZXlcMf4e+Yfdqn1nvnz6D3zg9Fd+/ZvR28oKgovy4pbcxUpPVRV9XNVOd0bS8lAREfARYrkt+Lz/LlqYU0HXW/ZZ9mDo5/evAWVXfL3OUdEtTqsAL9w/WTUs3dtYVa8fFxYT16uSfYQSEwtc1ZoKIRZdqzSsLR3bVd/b9u23GVlZUr5RQ9N8w7nc34XnfOneaKDlT557didfXura3Oz7c9ciYxSVXWCJhudITIgQ6KLmopEwEAQqW4py2quritPfvCH0zeMuvPDZuM630WHDeAZd46ROnba1SMSMi7W1dqJfAT0QtBDQi8Vqqfrh0zDCi1znMgbZWWRD0pLvY3nPjD9qAD223TNE3OErbrsrdtGzGiZH/+sqICt9EjtaDlEJihysgAxYTXDQFXqWhGU+hHKj2arau7U1Y+ds6LfDW8fVpZ9WAB+Zcow0r6j3TMSTl0dVhMXyMTMh9ARWibXYSXPtePb07b8XmVtzttLF0UW/OzZ6fbheK5DpXPvXSBGZPGc35+7PRJVVhW1hZtCHrpIV5M9KJckILKBLPlZnDldgAiIQ8mbuuKxiQsG3vB+7fdW3kTU7AC/cMNwqd8pqV7RiHOVpqQnK1IqXxwXUrLny5ZtZn1q27HXdpYpb82bC7beOn36MWMGbKCxd73lzrt75FclW2P/LMgPbWNMvgSr5jCJpDWuV0GJWCrEdAKAbhhDN+vTf4yduWKFXH7N0+81u5TdrADP/M3ZcvvOid7RsHO1ribOl4mVAwIpGQLqaknbiC2trC18qqIsa8aI2149otLmodLo380XHbNy2s9Hv9S9R9tNuXm7fowUPBHLqUIAfIyRKYVUbwTXreJcx1IG9NXffuy8EeU3vLmgWUFuNoBn3j5W5nNu/0iUq0GqMUkiZk7G7E+Y76qVZjo6t25X4XMz34bzfjHj1eNm/fWCv80TbHvx0rvHbm3fCe4MRdBlslLbRij0QsoOaXUnc3HyGt4S5pCRkXfBm6C6OZ+nWQD+SceTYNt2brdoNH2tFkqcJ0lGNLBGUUIdP1SeNuNv7dhe8I/f37d6zTs7dhxxY0Bz0JDfzSmZdcfYh7p0x3ZWFrtSJck2EPpE2Lx1rbYfb40ruWKVXPXI6Ln9b5yXbK7naBaAf/GrwpaxePISXUtPkKRUlAbmRsI4Wy5LmZE3vi6OPDrsV+9uaI57H000/p45NW/89txHB/TBEg6By7iE3Y5iSgCyoaYmT+MgJygFyQ/+OGHJqNtnms3xDE0O8PK/TohlxZIXhPTEZCIZhUJUhmJ53VerLCfy9rZtWY8M+9W8r5v6vkcrTf7TW3UvXH/6g8OGFNqxOLuC4LoOhM9TGFpYV/B4P0xS+XlK3Rs3nr168iPvNPlU1aQAz7zrQjkWLx8dDddcKkt1nXhP5TIVAtRTa1NG5P2S7S2ePOXm9/9nwG2gyx//MPFE7ZkPjT47BrOxdy0hVmsGXYRQWtYUckZutlzmdJaFaXRrU9+7yQB+77bzUEFebfe83LprZDndF0EKGZUApYphpLNml5XmPXLP3Zs/bar7HWt07UvvWa9kj3t81DC1tRwpvxAp1Vl8ToaKVBujKjovN0/ZtvCPo58Yfvu8JtUmmgzg7Nx0XkFezfWyXHMKJBYJXCSY5Bl2ZEVVIuu5fzxWs2r6rvXHpUB1oHTxo7NrV3c67/E2ipmnI2sCIumQWNdWFKNthFadkZNXsPqNX5y9ePJD7zSZLaBJAJ7+mzEkNz91lhauOR1L6SwsvCKABEwnstU0sl4v3SYtfGLDqv2C+8rga6CGqVSouarwpsBiBY8FTjZQmO+DX3tQHY1Qg6rWWQv+dtjtuk1Bz/5r25qf3pT7r8IWZo6OnaFCP6b8nbEinZqVm7g0J1fexIttb6r7NQnALQpxx5xY3cUSSbQL4GAK8LyQbZra2xu/Vt8c8/s53+mVyFm5yj/DEPAvh8DnkGbcZRq8qr4FMOTnd/HPv/nvVU3x7IebHvlyJWs3c8wH50wu7IQAaBlSajtD7EIZJ8MhBYxv30Fb//ot4x45/4HZTSJwHTLAz189Wc4trJgik1Q/CQKZBV5NCKTN6Ly6mjZvjrrj7R3/7fp8pUrSkdO5ACV+SAJ/KD6KWQZY2OAICTIOdOJbhbmbkygy7yIwZvWrYO4xyfJv/s9cv6jlsH+fNiLahhD7pzJ2shB/E1Wy2oYjlePyCzrP5cW+aIp7HTLAPXulT8uOVI8i/CEhl5gB8kDSzNqcMGMvLV3qLv++6xkVq4UQSfwFCR+8YgFCfPsZVgBA/QhuGMd8pCMMHEjAMWey3osufGxRanXPEa/LKulBJHI2Ai6E0IMScvq1b5W6aErPseseXTvnkEfxIQH89A9PlVq3SvxIwjVFHNhgwLlu2LUN/FLJVvzBlc/O+N55EoKGEbqHPzPck0nvXTZzAPIZ/tgGWND2Em1NdixrDoZ+L12tay88WSTi5Ea0yqFX/Lh7v0dvASsO9R6HBHDn3jkDVG3jQIRAOACIQWCa0irHlRaaBig/kDpEbIGQqgSoPqJA+D/6/EVRxqm53ml9T4KBA96z4MNjkj3vSWf/aaa94m+j3tfUcG9J8q4gJClB5CIipbvlt9567tRrJnxx1ZMzD8mBr9EAX9dzMG7btuoKLuq3EmxTtLYHdOC4+rzyHfG1E+/54ICGGNvtnn6gBL+/yDFEZTvotvzs3Pkc4EGYpPogEWUhOXl6NDW8/4DIyeBJ8PGh1N9ogH96TdHAeGjdcM5ewkD4lPOGN4zQZ44XWpxMqBUHWg88zgA7WDr7/g/dBX8c9WGX7mCA4ms9MUoRCF0sYaNTVjR95iPnD1994+sLG+2L1miAIznlYzBO5iPkYjEKPT9iW6Yyo7paWTvunhlHpavN0Upr1tVVtOugr3CIt5FodncOMJCQnR0KJU8dMCi7LXgdbGxs3Y0C+JkrB8fDEWMUwl44s8bL5VpH2cQ57cJdleiA5t4GOuYn0iagG15c5Q8bfNbnquQuVzS5O29NYfCRiWS1j+V6w3iRwwtwn77hUxRlcxc+90pCKPKAxGxH5sKVWjz+rnnN7dq6R6jg8UOVO6PFOfmVK2xHmaSr6SzIZy4+ivNisZrTX7jq0pcvn/pSo5YTGwVwNGqPl5Abz4R/IeD4asJy8ILKCmVnY+o7QQCMvvclY8Nzwz4jirxCU+RxEHKNAgJdV6weRW1rOvIiaxpT70EDfPf4MVo4Xj0aIk+lKCMom4a62fWltWs+lQ7aM+F/W8Tam8rL4aZwGK6kTB4LocG1QR8TySgobG0OAYcL4P6D5O6akmiLRcAtV14pr8JMaR8bqVjZ1S/MOmjrw3HHaw+Btu8wq9p3UDc4jl+ryVaWiHTD0I6EwsbA3488bepd8xcftGXroAFWtHBXM61W+oAkGPSYBzTLSOkLqnZGqw62rhO0N1388ApnQ/9RG30PL3JVdjKmDPgM2Y6tqPmFBQovctBrxQc/B0N1Y11d/M8ScBFFPnNoyDJsZWldmh7CQnV9ooX6VYVAN4YZy9g3Sw0NJRnb17p1/NCuGm29rrJHHRt2wIzyt8XUcCMVmq41yi590ACP/u3zK/nXysbcbP/EgvVfFCxUBP/vzp+RoQaQGyjwzzxuER5y43uCE85pqvqOeHywz6VFVm97RsEyYeAJEoSQZpb798YSZgJzj1uAm5qOOMAUixGbSZwiEqN4yAeIsnoTZj3ge60IU4bAceMn3+zUaICHgSkQIhNKCgIIiYQZfKy5vOmpEKRpAFDmFw1+ZUYi4TCSIJsNkvjlXJuvsJIYaZCkiCq8BYCPHV4CBVhmrsoAC+sxNhnGJqP4/KxWiEkG5+5+hoHzjuJhxuH//mcX5WVPAraTAorcib1ese47r7oSjBBeJIHr75PfsYJ1DRgWhKxbwAUaL/kk+Pio4TCNAviK9vcq+YW53SHwwzAzbWYY6e7X4oIQ2neehBAGwIvFQSoGIqc10NSK4Y6OW5TqgE1D5Gbm5GAtGGXSGwUXZ+r3ENRz2zi9Hr6qe1JGHGoUhMPUn/YBo3t4COynmb9xHMDM552iLlFUeqd72rbe1z6xjwXu/ZHXRnNhLVcJ/SybkbLxxo+Kz1/2/O5y08bcIMVhoiAP1HRQeGU2wkBETd7oTrRsHEnvNFBZVcqvveKLaUeM5TRuBEOQhzG8G0PcGe5bR2blHtavzO8lIdUDDOpX9PnQtmHEXUI6hzaTNJ935aC3KCoCEoYgrGBgOgykLQd4XoYXtFRKo//XZdPPwxH7eomPmd0AsyA25psngHs8Ddj7CTLHeffk93AceypC+O/8SOW3XzME0301ZN8oIX8gov70EAZ/4YeLG87zcxENumfpwL1NDvJvyUy4wkLfq8bA2p6v0Dk5Mlw499RzvqpIYPPStW8e9pHdSIAZZ8ysM4K0EwyY44FS5v3g7n/ENwRprLJiJQaUMAH5UQ10bRMCRJJAQYSAhEPAxtJKsH2XCXYkhc9Wje4pdbqsbOUM38zkPQP7cwz4vkfhTBcSQDCK+zi0zzs83ecSJcaqh4RZaohK7UKJqYNNKTbgie7jt137ZcagE/aqURgasShKtgaUuh4LbSDQYwSyMGbOEE2GY9K+/DFm8j0wgpbwS4y/dPkJbzofeZTRMNds87MkgiSFJWiWd+XCe5u8AzQKYBQwW8FF61PKHTpBCSHQu2MO+MGpbcDE7gWgvCYFtpbVgUHdWoBtVS3B7PXVYNrizQDWfCN+fcOHG+G+06Bq89mEsX3bNV+jHXXkDlSgm8+ZuS9Bv2tMskbE9bBQYYLEZz5TxEIppExiNqSVW5KRn6ZJfIfHjKKuWu1FIWb8IBenT4Ms507GyJRne166pjBktCbAiyPoJSTiYywrBQ7Sk4ypm3mVTR6E1iiAWZMbGhhwfQo++mI7+HJjOVh/WlvQKlsTic5AydLNYNbqEvBZSQqkXAg6yE1t3vy2ng3AH1qMha3k9HAZOCf5AFc7AFuEsWyV+b2ydflkXmSBKOcjoc6J2Csh6FEfYVZ27pJnt/BTW55qN3ZF3zZZ5apU94sY9k6zPDo4ptJt+ZpzswqcCRR4GxCiIUy8XpwPzTNg+F5+3WdN+mqg0VI0bGJFlAXGDRcqIGk6YFWpCUqSMoijBKhKu2DjLgiMTE40UC/TNcUtA9oXXgBywyQrjKzBGLL2aarMTzB9cx5KjSCIds2Tk6c/3mnSouu/nk4znix+Zu6nREiWu+u4uniONb3FpBdjMrs8BJMxzpf7hok3OyTZBWFmtiOQdqSA2CYM20kgmS4jzSKINQ5gttcsesgkRgEIPgQ4EINNW6tA70Fc4bAN4EMJGA4LYh64esXZasYxvv5BmuoR9qKTi9TTJWT1CuR+RpcnHDY/S6EFOheoIpCd1DKWU8CL7RSGGRSYToWWSICLyF4PZNe4db7q7+IaZHsGSQuCJVXo+VyLACbFO6q80ONf1covLy+u3m4i2ixeMI0CeO9ef4iNHPhDexw4L+NFyfXahAnA1loXnNSuJfjiw40gZVkgk9IQ7b55JosszfxRrzPD/cyl3/38NFDDAhmRfdMMl4GJMIbNIRC4HRilpgXiw2Qcau9Qt70GRVekJ7ULpc7gRadirhohhILJnCtJUAd7ewmHtRwdAyfOUIozA78GetQllEIPEWBi7WMbxWZf9tlrxYfWgP+dGg1wJn6INzKETYAxrmcKXEoWuiRXidKGBZIpB/ieU+9z2ZABD2TMXwzvVnkYg7sVsAN/CT/oIIGtbA+V/eJhOT11UNJbAXZMYJfPqofm4lqRfJhPsRTzkVhEJDrkXz0mTZMzMVTMQyIpLYLER3txNT1knhpCTq7HlQ4XqWuqgZ5oRQ3OrETsB2WENr/JtXFCFhLTRb0ce4iP2DCaMsNSCC1+kNq5spaBypgLvADM+vOBhYufRzToWDQANvMsQt1ie9W6j8s82FNBZlQNpoYMvJk4ij8UTcZFuHYcl3A72xyMNIgsNABZJ0zfnMPIEZruo0NvmIb8k3vkKae5iC0XqYex4K6eBDzXgXdGRkj92mW3KchCowpw9c8hNLO5CrSBl1i4djut7t2Nvx7nGJiJ5ZUDsbsdGjVSyEL1ebe/w1x0MAQzgaaCX4okriwAkIHatA92VKWB42e6QGYJkf9LhUETQfqNERPAequXCDbfU3n65hYZ2tP+gaATsGbE74moFBzrVyS10HF6KB+HLdIULajzpMcYIcvFSPd8gFQqn+VxwUsBbrssYI4rcdCqLFVsF8DFKwJzonH4+CWDI0j36/IJclrwKuNJFk+lPPlPKY+s/2oHo04P3uhQcCMBrn90Akz5EGZAsvkw8FhDKvUMfdcDw/2UEd8m7yibHNHayDhFJA4Dwej0QNJxwMadFcD2xRpivYApMkYjp0qFsgb9rBCjkQyTFVJsgB7dJ9zl2w/V8DuIY2QqV8XizGd6cDiqS4P4oO5ogSixKVlSkYQrz1k1rabh2iXDL1iJkLEQYPeHnOv2q6VZXXP4DW2RSBwyNQbMYVwOgC5nAS5Tq2specvzyX9Mn3xkejjpck5kwSgkkDCHydRmykG1e2OosVL0TuqDm7hgE2WZoRMc3X3+W/J1/Z8iPztrMBSCDANwDNVxaOvKsa2L7FM8oXZwAYRyoHFgqkaANwdngS7IqCAQxFwruTad/8TAhLOWsIwE25ChHQZ7MID93rzhBKs/QgOpXGZGOrbBdtQg81yaap8ngP47fkKzfbK6Jm3X7FlVkoa2EAofdnx3tgFJjcOUzfxYpQzcbUhsAsK7i8efyPFpigC/IgXknXW2XGk62Lr4k1eDJ7jBv+xvvHO96QKpxAB6k6ds+DY1bg5mzPQ8ukjwRUpZw+4IQuQQesV+2hh+YwTOJOMPGCzmYktpt5KQkp/ondXCAA5y+OnMkj8ImDAO1CchWWf8ryFUkjpYYeufjC8rmqkjMTnCeht0A8DsW/y5oUvVB8nUn/b5cUIUUFsbdh2HBOJvnR/aCqi3w+d6jUOJc8VX/9rLRFbpZ5sUyGsJdTZyXkNtqrjVLix3EdgmJg0R+O5whrYrTf0N5YZzd+nr+5jYqpzIyiSTP6VQ8mwUavYg9kYB/NyW3zCwBTRJPsnxZ16vYNV1Mef4iDgZlYNPaxmPzX1ddhAhLO0gu/+UZ5p8q5uLFz0kGvw7G/2HHz3I6s9/u8wBA3Xeon+KdjtsuTiP+IJ/hvacOMWPjBAHv8X59yhw1Ky3Hu10xAHew2J4gpqBDhrgJfff1jaa/WU+wYawv0LbirmpFPt6w/pE6spnGpc99SAvOtEZDoIOGmBIyk7OLyj+sYxSktAmfaa4VZXhR20zuhRkNrc4ODrYZdz6xzjo+/yP0kEDbJnptKrYYxSUiLDAeiQxfmBTXgFdz0+XNuYhDtIatlvXOkHfTwcNcPEG79NevchORae68OYQspCqO6c5fuLVP5592o7b31l8UKvvjcBq9yWTb/1dAYnAdn7IDXnYBtDG1K8FKSfhcB20pnzx35+3z/3ZrQjFYA7OQycRD/vmR2zVW2/fk/52pT+6457ubsTJ97H4zwViwzRIxSaWCGAHVYZq46YTdXNNNSFDg1ZUb6/cOP/x5wILzCV33iFTzLo4US8vYoV993P/E9wdnORqTIXVaBt04LaX/3pnIGlPnnJHCLXyOyOE48QjxZFEpPSf9//SO/PmKRJXNPNgCLdCOlZ9w026lr/LVOyqxX98utGJSg9+Dl6ws3rURP2jkE5aY+ZrQgdVVKsLsdQuw4bmfAneAc26U6cYvsKwL34n9bpeMEwvc8N2Ox+5AGnI93VWxwrZFtmXVoy5+2cLjcp0DQjR7izi30F8YgJFnjLxwl8Y77/20F58IxGpOceIpYdx9UwX7yRs4jBjymSYoKUghVZZitXfCCX7Q5mtgQg/zS/7cvQvriFVUnVnFMe/dBW3CNvsc4/C9TTk3GCF7BbEll5BBL0G6r1AzJCR74WNyxBGJ8ue/G+ZkjfH3X4jdnKsgZ5kj/YR7QoJ0Vncr/UBLYGevGLk+Cv/M3/W043SmQ8a4Klbl9JfmWfMcmn5RIwMkZ0OEmTHZcwGFuSZwu+oeQGu980UZCipFr7mDPJVpxPXq6olLNVRmXViDIxknj+Rq8xPSrXoRVNN53she5TkSWmFxCL7qzcRqe6RCieHC/dYySO7+B0sYS4WSWIoRllplKxNkWSFR9wuTAa9CELW+NuvfdgMuaob8X7sR9glPqM7CKCv7LJSZjSkn2KFUh2UlLYMASI13MdRnLChJ0+GGI5UfHmxnFZUJ2739nXnJqo6wxhgdYCyGiyBNvz+A4kPO0JIZ4CD0LX3pEapSSWlcFFubnQzH7lZvL0lgkyoSKn+jkxbPnXV4JKrp358EN4JB8ekM67wmVlALJyLxQnkoVotFZkTc7MXpqVUflKrG2Vp1ggVscsxIwsbUiL6gRMW2sfBrkObizh3dwK7tuaqW8LpyNsc5GLMpGAXO+zirYqhfUEhKEkjo60VNa9hIW+yFKfFjmZ7MASv8iHvbwltmrMBvmJSE+pIzXiPAgT28kIJjG4w8AQTdjfTtUJOljvM05zT+FNuD1VF31CN8DooeYonmfnMg47n+Y329mgUwE8/uWP7A3/RPgorsIfwlxMx/rJs9oBE6tu1R+grXuSA09Q3xC4ccHmYWRcWFCwQBu4yIOk6ztItL215OndCVhtSgKJUQsN5Od1nbhzSTCfyOBv30b6OE2qmYiBydWNPqqYeWu2k0RqR1E1yqY35hP7Cn+9Ijr5pSg2N07ewjXoyxRtsx52bKfJrEYGanlDn4XL05Lyn/5XuftY5EbHAJJ7TQz5Ee+Gb2QgVBpvhQsEwFCrROIIohD1Q6fn2SuqTT92vYa3xuZsmLsZyWj68SVheKfmE/b/U2LleRDtXwl5YLIZLkpOtaHBSXj5b9dglk5bf8HLz7J6ypzeJWFP1KeIslGpM9juFrsDDbZbuwZvsdGEUV+xQmUTIdoc6ObB+KXF/Pl2UtyxiYn3YAqacbu/7/hUESdXBMoollRIK3+XFls17+FF/5O9+uhpD+JSLQNt0JN2DcJlMsdT1yi71gVl//GeQC1tsa0zEOnbQGT0G4TdNgYUMESzAZd5EppIpm3KJi/wKT/L7wDi8lR9Y7neHa5Te6HMtoW+e8f/+vqux7dVoS9bSBfriiZOyV8YxZyPYD4nm4+rTcMcxB/XoFfkSvAyaZ0/dwK0nA5IPXehx1soUUMgZ6fX83LUul6S4FOYgV/1cq41Pt9N1O0A2640C4UwCxN/XjVusYgXZ9YQjMHYLXeQNc3XkMbEkT7QvCSOrd9++0jGlkLTBl+GnIEy78Wtt35Y3mq67Oxe2uIMIra3fNhXQPR09SBCQA13kQirxWVuPpLLLtbnpXNDGiMCxruK0dVWjN39WjCyy2aH2P0fc/JOnFzz4zD6S/4FQowG+8vm3E2uGnvNaJFw+kPdTHYvNJkiV6srS6JZF1rKXbhi54tLH5jf5KN7TEA0Dj2axHgw8X4I1iJFdiiWncJp8LtVIb5au2To/p2NU9gWAyA8c9qhk7zMjSDYHhfKrPYlJHi5W6uSFxFB3CD2fOHKFaoV3Z6mHBSDL1e2hVPVG8IHpcPCZG3L7K2Fp4vhbb/jPrPsfc6FPOVPBPq8PIIjlTPBWhnyFi4FcMCCUX+nx8ctk9vrdD3w+4qqf3S4V6M+pWfppTHeG2hxkO+R3cWXnOlIlf8IvXdyY9jokW3TxBmN2XkHuFaFwWQEBUAvMHsQepUqJRUWtomLTjZrvrQQcpJgFv/Gh4r0c8kEAqElLUR38686/lv1LqwkzaCC2DkwLCp1+y1Uy2D1nQw4wI2pEVc6YchPjEjEIp3SQ2px200LIElzVJ5uRrDwDS8Aq4kvBFO96KfaDH92Kki0Tkp9tDqa6dyXXe8Oh2qyVFFvVvuaPZbneb5jjrx/3symfF3+xxZZ8qa6OuJwBoE4KlrPH/2pKQpFlWKfWteHqeBQxJBiHjWskdsY9/6dzqRrx1vrSW+eutcL4edRJPRsi/2GH2BGUjbuBIwHwWX+dk1jbc+w0VUn1YDjVjkEParyFfU+6qHWryIYF95w3Y8Qdb/5Xd1C4n1/fU363IcuHmTgnPlqgiBYs3j5rH2kzKBGwZ+EOxCeTFvYAn+AC4cTp8rmXt7Irt1FW2pRrRbyzMOpneZbbn0VQjGa8cRhyWZIDugXGUB4ffxf5st8Hu8pKZbv+Gz8qlphpTyOU7ibHpVuIA6ZsWPJeTdE5N3wIs1k3JHnjZJes88Puhy5hGtX9n/CpoBN08E7gwNK66rQK2tAzgMSKaNj/ymdejRTBeZbqj3aJq2NfqiRJqfjAUdmbDnk16avPydsF8fC5csgsZNjRhBAR1mv7UV+aHMvKFuEY/zU7TIOjBZ8jWcNO38IdjTWszH+LeCmxj0vA+n0+zwVzXcZxfv89RHhf1q/1m0pKxh3DD6VAbeDD5SIK5Bq5jus0k4XKy7k0s3Sjvyu5fUgWnyy5sBQkirIZZ/nKv7m+m+Nq/jmUgm1agrxS91FqcXSYGuVywANYww+bWemzQiZcfs5Nv3w0sTP5TzUSG2JFkycnpKpfE1WaYnHpypYp4czblkz1FbVKW8xUR7ay0kNd3bmCMRcQzlY8SLCjWgovl1BTkaXh0vjSxuJzyABPfvj92k86jvpHh47pDgr0ejHocLXAQIqWPis7b/vnj14xeNOUZz/+TlOblFDFtJhWiFpiqEkQeBxyYcjPeG7uEyOoJfUS2VICgSOWzEpzTlfGT4dgiuw3R0goHRHmcpPW+qWKIupWguBVKGxVvFdhBhL8Jo6W1ioUpmxnInsf2+2exwJVxkaG6umDddPtaEG0DVvadHOL//SKeY8zMA/UnfHHm17Xd4Q7uzHrvJAUvUyp02eqfnhjXXHNxVIMXogiaBJGuBWvz5Vq2WfQIm8Qg3w48+6Hdp3zw1/LIIqexVEryVXnkQpUcqkHE0a1uRo76D22E8x75+n7Gp3/pEnWg7/e6C/Mzs9+Nydm5MvEKRShv5KcyNI1cv6E0fmb/mUPeeenLy/dr7Ke/MpMcV3hRT/becPSOV4ugUKNCABm30QjNiRocSxKZdcNOkxyi/EeF3bmCXs4lzj3m3bXqeMM13JnOzV2b4uYXIjlAhefuDO5AgD0bJ8hB6f8GrqW66x3cY5Qv/84+ubeNqJWkjGsusgJm0xCzFn46NTd93MqnSof+LebZdYffJt3oZ3UmDnzQTrh1hvF3guP8M9jVqkjcSmFMk24ywfbygdc6O1//9kZ//spQkr/zDcptm1PeBkyoID6uJhDS4zdJABf8MgCa1XHsa/oSrwv0tgoRGwFUwZDUvpkX6/64eARueW37Tj943sX7Bshv/Dtf4hjVo/Bk21bMQDySaAGCdtyg4FCuFXRepQtj4I1Hz8V1LPkxSednqde5Arhac1Hr+zXXjL7xUcCN5sewy6ocxgHmLNBj0+UWEhUnKtbvPnWLHor8PDsdtq5FiW0PmayAWAOt4eB4nBGwOdsiyTAuoUv73WvuQ8/nnmHEZPtjxc8v/vczPuDe3v1n+9005l116OZZAiNNEf+N2oyj47KSvAVkXOntmqTbqET+2TCRUTCOVsozMblEVY7aXJ29b0LwPrvun7dx280yllg7UevHtB16xZN+95yXy1+65BcgdYtaNw7NCc1GcAT7pnjLrx/3Kx4okU3GcIcIidai8gMwqxQWEGTWrXC6Vl/GP3X8XfOa3ZX0RP0DTWpT9bwW2enVjw08jkNZbeCEXYpVhIxxJmrguycqJ4+r3sPpfaFm0b95fKHP0g05X1P0HdTkzvdzZ9j7pj8g7ypUHNzVeKdhZCpAeRAGdLCmCZdNOIULTXn7jFTx/5u7v9E6sOJnTrB+37Ze1hMN/sCbIstZoQBlCKkg+q6+Jebt8SXnfvA4/vkB2kqanKAb5nxMR014qo1TK39BwSujlQ4DiNDQtDHKqltDyPOtV275uZ8cO+ER0fdNrOkqe9/NNFL141Te/fzzmtRsPFaFRvtGJcgWSZbDDONnGLZ8LalkqhZdz5vFrfZAbdOtZc8MGY5n4KfgVEc1jUwFOIkV0JtSYKsXRTBS7p08cjyB8/4x6CbZxyXu5G+dtNodUB/74fxWPm1mpLoBbGpBDoXJcB2IpWuxxa4rrVix/ZtzbJvcAM1m1/00Fvmplc+OGE+YghDQD1Fo8MxtiSRA1mWky1jyLtEbQ9iqx4b9diDD6U/ffHrZUedBNoY+s+vxwkYswYMcK+Nhssuk6VEV4hcKTCnMRk4dnyrYYReSCXlF0u3a9tumX7wKZgPhprV8X3AzTOrV/114mwKfRbhyqWuJYdhYnAh28eYmIVIr5lc1MqJ3XZr/ks/2jFm3vjfzz2mha9Xfn6KVNja7ta2MHWVHrLPVZTa1gg4iAWRjBKwzdhWIx17sq5We2VrMds68b5Zzb55SbNHNvT/5fu1H/1lzFw+8zgIwrSqwbEIp8XKE8Q4HQ9p3pk4320di0V6r3pkzOvLP/a+vO6lD4+pbc1m3XEmimc7ufkFxsRwuOJsVbbGEOJEhb+ayL5HmcYsK7YmnQo/X1OjTFuyBJf87MW5h+UdD0voyqm/mluz8E/j5wGIjCiAjsoFLxmbURENKGFDI5o3UMZeB6W11Tmk5776StbouaUl0PrV9KN/88kP7pykxLPSPVq2rp6sKMY5qmL2QDCNMrk/sFhABSkjttxI5T5VXaW989a7RsVdsw/fex222KThv52VWvTA2CU+ZSI13C4mS2cqcqo1FMEQyEGKwvIkyb6It0yHESPlnum6yPIu3Yas/HStkbzzvU+POqAX3HOmGo/bnXJzK06VpeQYTUuOIbKVHaSJC1JOYOD5uuk42oK62ugz1TV09qCbZtYe7uc8rMFnw26ZYzz1kzHL+g+QKvJy5dIwxefJCu7DWbbIvAIQckk4BE61PamXjI3l/QdJc7r1iC0bPnjUJx8tYHW/nTv/iAM96/ZxekErq31W9q5TFMk9XVVSwxTZbMf1/d0JXRhTAQd2l2FF3q+qiT1ZWyOvHPLruc0qLX8XHfbowqufmeuBZ8DGpQ9NeDwnHvo6N7v6YgmTUyQ1VchBFmtzgEvZYVlWRsleeLCM/WWREJnZtn3s87FnjVlfvMUpW/pRrfXg8s8PG9jPXTNIat8uK6eghdc+HK7pycEcJiveCFVx2hKcqvcjEq7PHmCe7lpO+JOEFZ5dUsql5RTZNO7O2UdsJ7gjFj465Bcza977zVlvJvLwJ4UtQpeGWNUESUr2ULAfySRookDBSV0OJ0c6fngIkfx1iowX5eWTT/sN0r++2hqzfWdpuHLWDDP9wLKmVzWeumyC0m8QzY5nWy0IMdsjUNmLSHSwqpl9FTmdj2Bm4YfV71pOqeK5vlJqWzkry3dFn93wFZj3gwc/OKSdQ5uCjmh88Jn3vStaacOcu0bcn5ff4qPC3JxLoF45COJ0a4RpKLNe6ABZqlUkkuzLqN7XdvSk65IvNNldqXeq+uS6n/ubp8DTE64TTtUZfrJ0Wzq96MNK888ffXlAzuI/6tEFDhkQUU7ulx2KhKRQOEQjAFeFHbuspSqTk2SJC4Cy01eWrZZ85HJFwKvPx5VxaGcUu54nVzhOdENdKv7+Z1/IL0+6b36jgvCag454ALigsb9fYE7/+ZjZ5aq+qnP3jmO16M6zNS3VT8ZOG4SQCpmXCVfh85ymmhFdJkM8Kp/i+LDG8/F26uEdimSVKIpXHFNZSc9O4W033jA4gSTiMYCpz7UVy3A93/eYqqlE0RDykc2FeIqZzxQz7bbSQtVtCUGtCYFtIDaKwmGntYxpnoRsBSIrmFsbwhoDDsOI5/mk2qP6l1z9+aCuqmDGipWpL66YOv+wpWc4EDoqABY06W+B6iAcvF9+5zcTZ3foZEzMyUtPVqRUTxmnChC2QxByQIQTDXIAgS5GGOTy8vyT6iNyXvHR5HshLeW6coVHYQXEMC32nPexSBTvpxllriS7ESIDmUJfhA4qHLfsWNhrIUlmHGFXWNp2byZQDyVocPXjvyilxOagVjtuqDid1hdV7cKvzZ2RteaWGe82e0KVxtBRA/CedPZ974uVphde+L/h73Tv0mpsQcuSM0Jqqg/GRiFGXpSPJo3DnPFgDzz1Mg4TUDghk3RM1lCMo9E5kMJgQxY98aqovqwrfDGDdR2wOwUi3Z1jVcz/QTRC4PwnUcqwwz9p35d3WTZnxYmc+du26jOXLvtsw53vbTmqdwg5KgFuoMv/vlBER7z+mz7j/jPqzLbti9rXjY7FjeFc5+zFBbJ8DF3hxamI3DsMSljEAkERjFbv8iTgYw3BXwGwDRl7UJBsLZOpD9WXzACOaBCjxhkAcynAlufptZYd2ZJMaR9XVpC5ZcU5n/7g728cMybVoxrgBrrvs9n+fZ8Bser09Z3DOz496fyeXXXN7hfSE335XN1TIn4bCYMsghwZQJuD7Yj34uwcY5FniwXCWsN+DjA4JbgtgL7gxb6IaQBU9UU6CtMDnP2iEtuObuKC02e1deiTTZtSG9+ZvqPmxS1fH1MmVEHHBMB70h8WbnL5R/har7kg1OPfvYe1VAcMLCwqKvTbhbSqVgwnOmHidGYUFUlIz8UYqwgzsdsHEW7s1GeO5wHTdf0kBUYZkVm5a6ONzM/dRv2WFVtLweZ16xPbb3r19SNimGhqOuYA3pOmpdexaTPXmWBmsEP2XrtkX6C2h3XRKigpHpebfOjSDCPWPAxqq2QmMZ3NBGuPuGWsuemYBvi/0TRri9ip6rgH8PvouAX4BGXoBMDHOZ0A+DinEwAf5/T/AYJ8a/BaDj0ZAAAAAElFTkSuQmCC",
            "PostLogo": null,
            "Slogan": "kfmsr",
            "SupportEmail": "kfmsr@gmail.com",
            "SupportPhoneNumber": "11111111111111",
            "SubscriptionStartOn": "2024-06-11T06:48:15Z",
            "SubscriptionRenewedAt": null,
            "SubscriptionExpiredOn": "2028-11-11T06:48:15Z",
            "ThemeID": "theme-brand",
            "SubscriptionStatus": 0,
            "SchemaID": "Light",
            "CurrentPlan": "1 Year Subscription",
            "PlanID": null,
            "PreviousPlan": null,
            "ApiKey": "c-PgKsQVjMFvUM9YHtcdluQ2DrKeycG6aDUbY1gu5BY0=",
            "Password": null,
            "RefTenantId": null,
            // "Id": "78898961-62d7-11f0-af02-64006a23a65e",
            "Id": "a202b6af-3de3-11f0-a033-64006a23a65e",
            "CreatedOn": 1737694275,
            "UpdatedOn": 1718088494,
            "CreatedBy": null,
            "UpdatedBy": null,
            "Active": true,
            "Deleted": false,
            "OrderNo": 0
        };
          const encryptedtenantDetails = this._encryptionService.encryptObject(this.tenantDetails, this.secretKey);
          localStorage.setItem(this.keyName, encryptedtenantDetails);
          return of(this.validateTenantInfo(this.tenantDetails));
        // }),
        // catchError((error) => {
        //   if (error.status === 404) {
        //     this.tenantDetails = new tenantDetails({});
        //     const encryptedtenantDetails = this._encryptionService.encryptObject(this.tenantDetails, this.secretKey);
        //     localStorage.setItem(this.keyName, encryptedtenantDetails);
        //     return of(this.validateTenantInfo(this.tenantDetails));
        //   } else {
        //     // Handle other errors if needed
        //     return of(false);
        //   }
        // })
      // );
    } else {
      const decryptedData = this._encryptionService.decryptObject(tenantData, this.secretKey);
      return of(this.validateTenantInfo(decryptedData));
    }
  }

  validateTenantInfo(tenantData: any): boolean {
    this._commanService.getTenantDetails?.next(tenantData);
    try {
      if (tenantData?.SubscriptionStatus === 0) {
        return true;
      } else {
        this._commanService.getTenantDetails.next(new tenantDetails({}));
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}



