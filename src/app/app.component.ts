import { Component, OnInit } from '@angular/core';
import { ElectronImplementationService } from './Services/electron-implementation.service';
import { IpcRenderer } from 'electron';


declare var ipcRenderer: IpcRenderer;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Auto update demo';
  appVersion = "";
  display = false;
  constructor(){
    setInterval(() => {
      this.display = true;
    },100)
  }


  ngOnInit(): void {
    ipcRenderer.send('get-version');
    ipcRenderer.on('get-version-replay', (event: any, arg: string) => {
      console.log('ipc-receive: ' + arg);
      this.appVersion = arg;
    });
  }

}
