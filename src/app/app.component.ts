import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ElectronImplementationService } from './Services/electron-implementation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Auto update demo';

  constructor(private electronService: ElectronService, private customServ: ElectronImplementationService){
    this.versionCheck();
    this.customServ.init();
  }

  versionCheck(): void{
    console.log("checking the version of this application");
  //   if (this.electronService.isElectronApp) {
  //     console.log("this is an electron application");   // cannot resolve sendSync of null
  // }
  //   this.electronService.ipcRenderer.on("meesage", (event, text) => {
  //     console.log(event,text);
  //   });
  }
}
