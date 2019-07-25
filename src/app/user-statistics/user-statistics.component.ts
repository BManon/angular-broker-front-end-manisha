import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { Capacity } from '../models/capacity.model';

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.css']
})
export class UserStatisticsComponent implements OnInit {

//  @Input() supplierId : string;
  loggedUser: User;
  userSubscription: Subscription;
  capa_obj: {};
  capacities: Capacity[];
  capaSubscription: Subscription;
  machines: String[];

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }
  
  machine_eq={
    SMALL_SIMPLEX: "Kleiner 3D-Drucker, Einfarbig",
    SMALL_DUPLEX: "Kleiner 3D-Drucker, Zweifarbig",
    SMALL_SUPPORT: "Kleiner 3D-Drucker, Mit Stützmaterial",
    LARGE_SIMPLEX: "Großer 3D-Drucker, Einfarbig",
    LARGE_DUPLEX: "Großer 3D-Drucker, Zweifarbig",
    LARGE_SUPPORT: "Großer 3D-Drucker, Mit Stützmaterial",
  }
  
  ngOnInit() {
    if(this.authService.getActualUser()){
      //console.log(this.authService.getActualUser());
      this.userSubscription = this.authService.userSubject.subscribe(
        (user: User) => {
          this.loggedUser = user;
          this.machines = user.machines;
        }
      );
      this.authService.emitUserSubject();
    };
    let k=0;
    while (this.machines[k]){
      console.log("init " , this.machines[k] );
    this.authService.getUserCapacities(this.machines[k]);
    this.capa_obj={};
    if(this.authService.getActualUserCapacities()){
      this.capaSubscription = this.authService.capacitiesSubject.subscribe(
        (capa: Capacity[]) => {
          this.capacities = capa;
          this.capa_obj[this.machines[k]]=capa;
      });
      
      this.authService.emitCapaSubject();
    };
    console.log(name, ' capa: ',this.capacities);
    k++;
    }
    
  }

  ngOnDestroy(){
    this.capacities.splice(0,this.capacities.length);
  }

  goToPriceManagement(){
    this.router.navigate(['/price-management'])
  }

  onSignOut() {
    this.authService.signOut();
  /*  location.reload();*/
  
  }

}
