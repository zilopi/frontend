import { Injectable } from '@angular/core';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  userLoggedIn = false;
  constructor() { }

   login(email: String, password: String) {

    // Implement login functionalty
    const login = new Promise((resolve , reject) => {

      if (email != 'atulvinod1911@gmail.com' || password != 'atul') {
        setTimeout(() => {
          reject();
        }, 2000);
      } else {
        setTimeout(() => {
          this.userLoggedIn = true;
          resolve({name: 'Atul Vinod', email: 'atulvinod1911@gmail.com'});
        }, 2000);


      }

    });
    return login;
  }
}
