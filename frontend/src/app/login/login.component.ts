import { Component } from '@angular/core';
import { toast as superToast } from 'bulma-toast'
import { faEnvelope, faLock,  faCheck, faXmark, faFlagCheckered, faCloudArrowUp, faCircleCheck, faCircleXmark, faExternalLinkAlt,faCircleUp, faPersonDigging, faFire } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../common/ApiService/api-service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../common/User/user.service';
import {Crypto} from '../common/Crypto/crypto';
import { Buffer } from 'buffer';
import { LocalVaultV1Service, UploadVaultStatus } from '../common/upload-vault/LocalVaultv1Service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  faEnvelope=faEnvelope;
  faLock=faLock;
  faCheck=faCheck;
  faCircleXmark=faCircleXmark;
  faFire=faFire;
  faPersonDigging=faPersonDigging
  faCircleCheck=faCircleCheck;
  faXmark=faXmark;
  faFlagCheckered=faFlagCheckered;
  faExternalLinkAlt=faExternalLinkAlt;
  faCircleUp=faCircleUp;
  faCloudArrowUp=faCloudArrowUp;
  password:string = "";
  hashedPassword:string = "";
  isLoading = false;
  warning_message="";
  warning_message_color="is-warning";
  error_param: string|null=null;
  isUnsecureVaultModaleActive = false;
  isPassphraseModalActive = false;
  local_vault_service: LocalVaultV1Service | null = null;
  is_oauth_flow=false;
  zero_totp_maintenance=false;
  zero_totp_issue=false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private crypto:Crypto,
    private localVaultv1: LocalVaultV1Service,
    ) {
    }

    ngOnInit(){
      this.error_param = this.route.snapshot.paramMap.get('error_param')
      switch(this.error_param){
        case null:{
          break;
        }
        case 'sessionKilled':{
          this.warning_message = "For your safety, you have been disconnected because you have reloaded or closed the tab";
          
          this.userService.clear();
          break;
        }
        case 'sessionTimeout':{
          this.warning_message = "For your safety, you have been disconnected after 10min of inactivity"
          this.userService.clear();
          break;
        }

        case 'sessionEnd':{
          this.warning_message = "For your safety, your session must be renewed every hour."
          
          break;
        }

        case 'maintenance':{
            this.zero_totp_maintenance = true;
         
          
          break;
        }

        case 'issue':{
            this.zero_totp_issue = true;
           
           break;
         }

        case 'confirmPassphrase':{
          this.warning_message = "To continue, please confirm your passphrase"
          
          this.warning_message_color="is-success";
          this.userService.clear();
          this.is_oauth_flow=true;
          break;
        }
      }
      
    }


  openFile(event: any): void {
    const input = event.target;
    const reader = new FileReader();
    reader.readAsText(input.files[0], 'utf-8');
    reader.onload = (() => {
      if (reader.result) {
        try{
          const unsecure_context = reader.result.toString();
          const version = this.localVaultv1.extract_version_from_vault(unsecure_context);
          if(version == null){
            superToast({
              message: "Error : Impossible to import your vault. Impossible to read it",
              type: "is-danger",
              dismissible: false,
              duration: 20000,
              animate: { in: 'fadeIn', out: 'fadeOut' }
            });
            
          } else if (version == 1){
            this.local_vault_service = this.localVaultv1
          this.local_vault_service.parseUploadedVault(unsecure_context).then((vault_parsing_status) => {
          switch (vault_parsing_status) {
            case UploadVaultStatus.SUCCESS:{
              this.isPassphraseModalActive = true;
              
              break
            }
            case UploadVaultStatus.INVALID_JSON: {
              superToast({
                message: "Error : Invalid file type",
                type: "is-danger",
                dismissible: false,
                duration: 20000,
                animate: { in: 'fadeIn', out: 'fadeOut' }
              });
              
              break;
            }

            case UploadVaultStatus.INVALID_VERSION: {
              superToast({
                message: "Error : Impossible to import your vault. Unsupported version",
                type: "is-danger",
                dismissible: false,
                duration: 20000,
                animate: { in: 'fadeIn', out: 'fadeOut' }
              });
              
              break;
            }
            case UploadVaultStatus.NO_SIGNATURE: {
              superToast({
                message: "Error : Impossible to import your vault. No signature found",
                type: "is-danger",
                dismissible: false,
                duration: 20000,
                animate: { in: 'fadeIn', out: 'fadeOut' }
              });
              
              break;
            }
            case UploadVaultStatus.INVALID_SIGNATURE: {
              this.isUnsecureVaultModaleActive = true;
              
              break;
            }
            case UploadVaultStatus.MISSING_ARGUMENT: {
              superToast({
                message: "Error : Impossible to import your vault. It seems to not be complete",
                type: "is-danger",
                dismissible: false,
                duration: 20000,
                animate: { in: 'fadeIn', out: 'fadeOut' }
              });
              
              break;
            }
            case UploadVaultStatus.INVALID_ARGUMENT: {
              superToast({
                message: "Error : Impossible to import your vault. It seems to be corrupted",
                type: "is-danger",
                dismissible: false,
                duration: 20000,
                animate: { in: 'fadeIn', out: 'fadeOut' }
              });
              
              break;
            }

              case UploadVaultStatus.UNKNOWN: {
                superToast({
                  message: "Error : Impossible to import your vault. Unknown error",
                  type: "is-danger",
                  dismissible: false,
                  duration: 20000,
                  animate: { in: 'fadeIn', out: 'fadeOut' }
                });
                
                break;
              }

            default: {
              superToast({
                message: "Error : Impossible to import your vault. Unknown error",
                type: "is-danger",
                dismissible: false,
                duration: 20000,
                animate: { in: 'fadeIn', out: 'fadeOut' }
              });
              
              break;
          }
        }
      });
    }
    else {
      superToast({
        message: "Error : Impossible to import your vault. Unsupported version",
        type: "is-danger",
        dismissible: false,
        duration: 20000,
        animate: { in: 'fadeIn', out: 'fadeOut' }
      });
      
    }
      } catch(e){
          superToast({
            message: "Error : Impossible to parse your file",
            type: "is-danger",
            dismissible: false,
            duration: 20000,
            animate: { in: 'fadeIn', out: 'fadeOut' }
          });
          
        }
      } else {
        superToast({
          message: "Error : Impossible to parse your file",
          type: "is-danger",
          dismissible: false,
          duration: 20000,
          animate: { in: 'fadeIn', out: 'fadeOut' }
        });
        
      }
    });

    }

    
      


    openLocalVault(){
      this.userService.clear();
      this.userService.setVaultLocal(true);
      this.userService.setLocalVaultService(this.local_vault_service!);
      this.userService.setDerivedKeySalt(this.local_vault_service!.get_derived_key_salt()!);
        this.deriveKey().then((derivedKey)=>{
            this.decryptZKEKey(this.local_vault_service!.get_zke_key_enc()!, derivedKey).then((zke_key)=>{
              this.userService.set_zke_key(zke_key!);
              this.router.navigate(["/vault"], {relativeTo:this.route.root});
            }, (error)=>{
              superToast({
                message: error,
                type: "is-danger",
                dismissible: false,
                duration: 20000,
                animate: { in: 'fadeIn', out: 'fadeOut' }
              });
              this.isLoading=false;
            });
        },(error)=>{
          superToast({
            message: error,
            type: "is-danger",
            dismissible: false,
            duration: 20000,
            animate: { in: 'fadeIn', out: 'fadeOut' }
          });
              this.isLoading=false;
        });
    }

  


  deriveKey() : Promise<CryptoKey>{
    return new Promise((resolve, reject) => {
      const derivedKeySalt = this.userService.getDerivedKeySalt();
      if(derivedKeySalt != null){
        this.crypto.deriveKey(derivedKeySalt, this.password).then(key=>{
          resolve(key);
        });
      } else {
        this.isLoading=false;
        reject("Impossible to retrieve enough data to decrypt your vault");
      }
    });
  }



  decryptZKEKey(zke_key_encrypted: string, derivedKey: CryptoKey): Promise<CryptoKey> {
    return new Promise((resolve, reject) => {
      this.crypto.decrypt(zke_key_encrypted, derivedKey).then(zke_key_b64=>{
        if (zke_key_b64 != null) {
          const zke_key_raw = Buffer.from(zke_key_b64!, 'base64');

          window.crypto.subtle.importKey(
            "raw",
            zke_key_raw,
            "AES-GCM",
            true,
            ["encrypt", "decrypt"]
          ).then((zke_key)=>{
            resolve(zke_key);
          }, (error)=>{
            reject("Impossible to decrypt your key. "+ error);
          });;
        } else {
          if(this.userService.getIsVaultLocal()!){
            reject("Wrong passphrase");
          } else {
            reject("Impossible to decrypt your key");
          }
          
        }
        
      });
  });
  }
}
