import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [CommonModule, RouterLink,RouterLinkActive],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.scss'
})
export class NavBlankComponent {

userName: string = '';
  constructor(private _Router: Router) {

  }

  signOut(): void {
    localStorage.removeItem('token');
    this._Router.navigate(['/login']);
  }

}
