import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {Header} from './components/header/header';
import {Translation} from './services/translation';
import {LocalStorage} from './services/local-storage';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatIconModule, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly translation = inject(Translation);
  readonly storage = inject(LocalStorage);
  readonly t = () => this.translation.t();
}

