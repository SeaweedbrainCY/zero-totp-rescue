import { Component, OnInit } from '@angular/core';
import { UserService } from '../common/User/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faPen, faSquarePlus, faCopy, faCheckCircle, faCircleXmark, faDownload, faDesktop, faRotateRight, faChevronUp, faChevronDown, faChevronRight, faLink, faCircleInfo, faUpload, faCircleNotch, faCircleExclamation, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../common/ApiService/api-service';
import { Crypto } from '../common/Crypto/crypto';
import { toast as superToast } from 'bulma-toast'
import { Utils } from '../common/Utils/utils';
import { error } from 'console';
import { formatDate } from '@angular/common';
import { LocalVaultV1Service } from '../common/upload-vault/LocalVaultv1Service.service';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css'],
  standalone: false
})
export class VaultComponent implements OnInit {
  faPen = faPen;
  faSquarePlus = faSquarePlus;
  faCopy = faCopy;
  faGoogleDrive=faGoogleDrive;
  faCircleXmark= faCircleXmark;
  faCheckCircle = faCheckCircle;
  faRotateRight = faRotateRight;
  faCircleNotch = faCircleNotch;
  faDesktop=faDesktop;
  faCircleExclamation=faCircleExclamation;
  faDownload=faDownload;
  faChevronUp=faChevronUp;
  faChevronDown=faChevronDown;
  faChevronRight=faChevronRight;
  faLink=faLink;
  faCircleInfo=faCircleInfo;
  faCircleQuestion=faCircleQuestion;
  faUpload=faUpload;
  vault: Map<string, Map<string,string>> | undefined;
  vaultDomain : string[] = [];
  remainingTime = 0;
  totp = require('totp-generator');
  isModalActive = false
  reloadSpin = false
  storageOptionOpen = false
  local_vault_service :LocalVaultV1Service | null  = null;
  page_title="Here is your TOTP vault";
  isRestoreBackupModaleActive=false;
  isGoogleDriveEnabled = true;
  isGoogleDriveSync = "loading"; // uptodate, loading, error, false
  lastBackupDate = "";
  faviconPolicy = "";
  constructor(
    public userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private crypto: Crypto,
    private utils: Utils,
    private bnIdle: BnNgIdleService,
    ) {  }

  ngOnInit() {
    if(this.userService.getId() == null && !this.userService.getIsVaultLocal()){
      this.router.navigate(["/openVault/sessionKilled"], {relativeTo:this.route.root});
    } else if(this.userService.getIsVaultLocal()){
      this.local_vault_service = this.userService.getLocalVaultService();
      let vaultDate = "unknown"
      try{
        const vaultDateStr = this.local_vault_service!.get_date()!.split(".")[0];
        vaultDate = String(formatDate(new Date(vaultDateStr), 'dd/MM/yyyy HH:mm:ss O', 'en'));
      }catch{
        vaultDate = "error"
      }
      

      this.page_title = "Backup from " + vaultDate;
      this.decrypt_and_display_vault(this.local_vault_service!.get_enc_secrets()!);
    } else {
      this.router.navigate(["/openVault/sessionKilled"], {relativeTo:this.route.root});
    }    
  }

  startDisplayingCode(){
        setInterval(()=> { this.generateTime() }, 20);
        setInterval(()=> { this.generateCode() }, 100);
  }

  

  decrypt_and_display_vault(encrypted_vault:any){
    this.reloadSpin = true
      this.vault = new Map<string, Map<string,string>>();
    try{
     if(this.userService.get_zke_key() != null){
      try{
        this.startDisplayingCode()
        for (let secret of encrypted_vault){
          this.crypto.decrypt(secret.enc_secret, this.userService.get_zke_key()!).then((dec_secret)=>{
            if(dec_secret == null){
              superToast({
                message: "Wrong key. You cannot decrypt one of the secrets. Displayed secrets can not be complete. Please log out  and log in again.",
                type: "is-danger",
                dismissible: false,
                duration: 20000,
              animate: { in: 'fadeIn', out: 'fadeOut' }
              });
              let fakeProperty = new Map<string, string>();
              fakeProperty.set("color","info");
              fakeProperty.set("name", "🔒")
              fakeProperty.set("secret", "");

              this.vault?.set(secret.uuid, fakeProperty);
            } else {
                try{
                  this.vault?.set(secret.uuid, this.utils.mapFromJson(dec_secret));
                  this.userService.setVault(this.vault!);
                  this.vaultDomain = Array.from(this.vault!.keys()) as string[];
                } catch {
                  superToast({
                    message: "Wrong key. You cannot decrypt one secret. This secret will be ignored. Please log   out and log in again.   ",
                    type: "is-danger",
                    dismissible: false,
                    duration: 20000,
                  animate: { in: 'fadeIn', out: 'fadeOut' }
                  });
                }
              }
          }).catch((error)=>{
            superToast({
              message: "An error occurred while decrypting your secrets." + error,
              type: "is-danger",
              dismissible: false,
              duration: 20000,
            animate: { in: 'fadeIn', out: 'fadeOut' }
            });
          });
        }
        this.reloadSpin = false
      } catch {
        superToast({
          message: "Wrong key. You cannot decrypt this vault.",
          type: "is-danger",
          dismissible: false,
          duration: 20000,
        animate: { in: 'fadeIn', out: 'fadeOut' }
        });
      }
    } else {
      superToast({
        message: "Impossible to decrypt your vault. Please log out and log in again.",
        type: "is-danger",
        dismissible: false,
        duration: 20000,
      animate: { in: 'fadeIn', out: 'fadeOut' }
      });
    }
    } catch(e){
      superToast({
        message: "Error : Impossible to retrieve your vault from the server",
        type: "is-danger",
        dismissible: false,
        duration: 20000,
      animate: { in: 'fadeIn', out: 'fadeOut' }
      });
    }
  }

  navigate(route:string){
    this.router.navigate([route], {relativeTo:this.route.root});
   
  }

  generateTime(){
    const duration = 30 - Math.floor(Date.now() / 10 % 3000)/100;
    this.remainingTime = (duration/30)*100
  }

  generateCode(){
    for(let domain of this.vaultDomain){
      const secret = this.vault!.get(domain)!.get("secret")!;
      try{
        let code=this.totp(secret); 
        this.vault!.get(domain)!.set("code", code);
      } catch (e){
        let code = "Error"
        this.vault!.get(domain)!.set("code", code);
      }
   
    }


  }


  copy(){
    superToast({
      message: "Copied !",
      type: "is-success",
      dismissible: true,
    animate: { in: 'fadeIn', out: 'fadeOut' }
    });
  }

  reload(){
    this.ngOnInit();
  }
  
  


}