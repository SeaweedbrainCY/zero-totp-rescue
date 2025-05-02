import { Component } from '@angular/core';
import { faCirclePlus, faTruckMedical } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.css'],
  standalone: false
})
export class ChangelogComponent {
  faCirclePlus = faCirclePlus;
  faTruckMedical = faTruckMedical;
  imageHash = environment.imageHash;

  changelogs = [
    {
      date: "02/05/2025",
      version: "1.6",
      added: [
        "Rescue Zero-TOTP now help you knowing when Zero-TOTP is back online !",
        
        
      ],
      fixed:[
        "Some UI improvements.",
        "We fixed several CVE vulnerabilities from the dependencies.",
      ]
    },
    {
      date: "05/12/2024",
      version: "1.5",
      added: [
        "Following Zero-TOTP new features, Rescue Zero-TOTP is now also available as a PWA application ! Install it on your phone or desktop and use it offline ! ",
        
      ],
      fixed:[
        
      ]
    },
    {
      date: "20/11/2024",
      version: "1.4",
      added: [
        "Rescue Zero-TOTP is now warning you when Zero-TOTP is encountering issue."
        
      ],
      fixed:[
        
      ]
    },
    {
      date: "14/07/2024",
      version: "1.3",
      added: [
        
      ],
      fixed:[
        "We fixed several CVE vulnerabilities from the dependencies.",
      ]
    },
    {
      date: "03/04/2024",
      version: "1.1",
      added: [
        
      ],
      fixed:[
        "We fixed several CVE vulnerabilities from the dependencies.",
      ]
    },
    {
      date: "22/01/2024",
      version: "1.0",
      added: [
        "A complete and reliable version of Zero-TOTP, with only basic features and no need of backend.",
      ],
      fixed:[
      ]
    },
    {
      date: "25/11/2023",
      version: "b0.1",
      added: [
        "All the basis of Rescue Zero-TOTP, forked from Zero-TOTP.",
      ],
      fixed:[
      ]
    }
  ];

}
