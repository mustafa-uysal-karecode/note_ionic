import { Component } from '@angular/core';
import axios from 'axios';
import { ActionSheetController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  data: any = null;
  id: any = null;
  error: any = null;
  todo: string = "";
  handlerMessage: string = '';
  roleMessage: string = '';

  public alertButtons = [
    {
      text: 'İptal',
      role: 'cancel',
      handler: () => { this.handlerMessage = 'Alert canceled'; }
    },
    {
      text: 'Sil',
      role: 'confirm',
      handler: () => { this.delTodo() }
    }
  ];

  constructor(
    public actionSheetController: ActionSheetController,
    public alertController: AlertController
    ) {
    this.loadData();
  }

  async delTodo() {
    const id = { id: this.id };
    
    axios.post("http://localhost:3000/del_note", id, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      //console.log(response);

      if (response.data.status) {
        this.loadData()
        this.todo = ""
        this.id = null
      }
    })
    .catch(error => {
      console.error(error);
    });
  }

  isGir() {
    const data = { todo: this.todo };
    
    axios.post("http://localhost:3000/add_note", data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      //console.log(response);

      if (response.data.status) {
        this.loadData()
        this.todo = ""
      }
    })
    .catch(error => {
      console.error(error);
    });
  }

  async loadData() {
    
      const response = await axios.get('http://localhost:3000/get_notes');
      //alert()
      this.data = response.data.data;
      
    
  }

  async presentActionSheet(event: any) {
    //console.log(event.id)
    this.id = event.id
    const actionSheet = await this.actionSheetController.create({
      header: 'Seçenekler',
      buttons: [
        {
          text: 'Sil',
          handler: () => {
            this.presentYesNoAlert()
          }
        },
        {
          text: 'İptal',
          role: 'cancel',
          handler: () => {
            this.id = null;
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async presentYesNoAlert() {
    const alert = await this.alertController.create({
      header: 'Onay Kutusu',
      message: 'Silmek İstiyor Musunuz?',
      buttons: [
        {
          text: 'Hayır',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('User clicked "No"');
          }
        }, {
          text: 'Evet',
          handler: () => {
            this.delTodo()
          }
        }
      ]
    });
  
    await alert.present();
  }

}
