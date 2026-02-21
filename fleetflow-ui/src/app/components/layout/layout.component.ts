import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit, OnDestroy {
  title = 'Dashboard';
  isMobile = false;
  private destroyed = new Subject<void>();
  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => (this.isMobile = result.matches));

    this.updateTitle();
    this.router.events
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => this.updateTitle());
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  closeIfMobile(sidenav: MatSidenav) {
    if (this.isMobile) {
      sidenav.close();
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private updateTitle() {
    const url = this.router.url;
    if (url.includes('dashboard')) this.title = 'Dashboard';
    else if (url.includes('vehicles')) this.title = 'Vehicles';
    else if (url.includes('drivers')) this.title = 'Drivers';
    else if (url.includes('dispatch')) this.title = 'Dispatch';
    else if (url.includes('maintenance')) this.title = 'Maintenance';
    else if (url.includes('fuel')) this.title = 'Fuel';
    else this.title = 'Dashboard';
  }
}
