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
