import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;
  let loadingElementSpy: any;
  let toastElementSpy: any;

  beforeEach(waitForAsync(() => {
    authSpy = jasmine.createSpyObj('AuthService', ['signIn']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    toastElementSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);
    toastControllerSpy.create.and.returnValue(Promise.resolve(toastElementSpy));

    loadingElementSpy = jasmine.createSpyObj('HTMLIonLoadingElement', ['present', 'dismiss']);
    loadingControllerSpy = jasmine.createSpyObj('LoadingController', ['create']);
    loadingControllerSpy.create.and.returnValue(Promise.resolve(loadingElementSpy));

    TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastController, useValue: toastControllerSpy },
        { provide: LoadingController, useValue: loadingControllerSpy },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LoginPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con email y password', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.get('email')).toBeTruthy();
    expect(component.form.get('password')).toBeTruthy();
    expect(component.form.invalid).toBeTrue();
  });

  it('togglePassword debería cambiar el estado de showPassword', () => {
    const initial = component.showPassword;
    component.togglePassword();
    expect(component.showPassword).toBe(!initial);
  });

  it('no debería llamar a AuthService.signIn si el formulario es inválido', async () => {
    component.form.reset(); // fuerza inválido

    await component.onSubmit();

    expect(authSpy.signIn).not.toHaveBeenCalled();
    expect(toastControllerSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        message: 'Completa tu correo y contraseña',
      })
    );
  });

  it('debería llamar a AuthService.signIn y navegar al dashboard cuando el formulario es válido', async () => {
    component.form.setValue({
      email: 'test@correo.com',
      password: '123456',
    });

    authSpy.signIn.and.returnValue(Promise.resolve());

    await component.onSubmit();

    expect(loadingControllerSpy.create).toHaveBeenCalled();
    expect(authSpy.signIn).toHaveBeenCalledWith('test@correo.com', '123456');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(loadingElementSpy.dismiss).toHaveBeenCalled();
  });

  it('goToRegister debería navegar a /register', () => {
    component.goToRegister();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('goToForgot debería navegar a /forgot-password', () => {
    component.goToForgot();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/forgot-password']);
  });
});
