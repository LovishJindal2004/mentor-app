export const environment = {
    production: false,
    liveQuizNegativeMark: .25,
    tenantname:'rhythm',
    questionMarks: 4,
    apiKey: "0737afb2-6f26-47ad-9f66-11572d806f53",
    // apiURL: "https://api.entermbbs.com/api/v1",  
    apiURL: "http://192.168.1.17:91/api/v1",  
    dynmoDB:"https://z0p411vwsa.execute-api.ap-south-1.amazonaws.com/dev",
    //  externalApiURL: "https://api.entermbbs.com",
    externalApiURL: "http://192.168.1.17:91",
    tenantvalidateURl: "https://api.adrplexus.com/saas-admin-dev",
    OAuthConfiguration: {
      ApiClientID: "a2db852e6f28416f925dddeece5bfa96",
      ApiUserName: "elms",
      ApiPassword: "elms@123",
      ApiGrantType: "password"
    },
    supportedCountryCode: ["+91"]
  };
  export const AppSyncenvironment = {
    production: false,
    API_KEY: 'da2-luvbj56kcjbknppwbdm3rc4m3i',
    host: 'https://h24veioscjamzjfidk6ryphv2a.appsync-api.ap-south-1.amazonaws.com/graphql'
  };
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
  