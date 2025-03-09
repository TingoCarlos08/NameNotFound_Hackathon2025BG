import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, CardContent, CardFooter } from '../ui';
import './RegisterForm.css';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  identificationNumber: string;
  identificationType: 'cedula' | 'pasaporte';
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  identificationNumber?: string;
  identificationType?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    identificationNumber: '',
    identificationType: 'cedula',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validar nombre completo
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre es obligatorio';
      isValid = false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingrese un email válido';
      isValid = false;
    }

    // Validar teléfono
    const phoneRegex = /^\d{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
      isValid = false;
    } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Ingrese un número de teléfono válido (10 dígitos)';
      isValid = false;
    }

    // Validar número de identificación
    if (!formData.identificationNumber.trim()) {
      newErrors.identificationNumber = 'El número de identificación es obligatorio';
      isValid = false;
    }

    // Validar tipo de identificación
    if (!formData.identificationType) {
      newErrors.identificationType = 'El tipo de identificación es obligatorio';
      isValid = false;
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulación de llamada a API para registro
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En una implementación real, aquí se haría la llamada al backend
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Error en el registro');
      // }
      
      // const data = await response.json();
      // localStorage.setItem('token', data.token);
      
      // Simulamos almacenamiento de datos del usuario
      localStorage.setItem('user', JSON.stringify({
        id: 'user-' + Date.now(),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        identificationType: formData.identificationType,
        identificationNumber: formData.identificationNumber,
        trustIndex: 10, // Índice de confianza inicial
        currentStage: 'conocer', // Etapa inicial del journey
        profileCompleted: false, // Indicador de perfil completo
      }));

      // Notificar éxito y redirigir
      onRegisterSuccess();
    } catch (error) {
      setErrors({
        general: 'Error al registrar usuario. Intente nuevamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-form-container">
      <Card variant="elevated">
        <CardHeader 
          title="Crear una cuenta" 
          subheader="Regístrate para comenzar tu viaje financiero" 
        />
        <CardContent>
          <form onSubmit={handleSubmit} className="register-form">
            {errors.general && (
              <div className="error-message general-error">{errors.general}</div>
            )}
            
            <div className="form-field">
              <Input
                label="Nombre completo"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ingrese su nombre completo"
                error={!!errors.fullName}
                helperText={errors.fullName}
                fullWidth
              />
            </div>
            
            <div className="form-field">
              <Input
                label="Correo electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
              />
            </div>
            
            <div className="form-field">
              <Input
                label="Teléfono"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ingrese su número de teléfono"
                error={!!errors.phone}
                helperText={errors.phone}
                fullWidth
              />
            </div>
            
            <div className="form-field identification-field">
              <div className="identification-type">
                <label>Tipo de identificación</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="identificationType"
                      value="cedula"
                      checked={formData.identificationType === 'cedula'}
                      onChange={handleChange}
                    />
                    Cédula
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="identificationType"
                      value="pasaporte"
                      checked={formData.identificationType === 'pasaporte'}
                      onChange={handleChange}
                    />
                    Pasaporte
                  </label>
                </div>
                {errors.identificationType && (
                  <div className="error-text">{errors.identificationType}</div>
                )}
              </div>
              <Input
                label="Número de identificación"
                name="identificationNumber"
                value={formData.identificationNumber}
                onChange={handleChange}
                placeholder={`Ingrese su ${formData.identificationType === 'cedula' ? 'cédula' : 'pasaporte'}`}
                error={!!errors.identificationNumber}
                helperText={errors.identificationNumber}
                fullWidth
              />
            </div>
            
            <div className="form-field">
              <Input
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Cree una contraseña"
                error={!!errors.password}
                helperText={errors.password}
                fullWidth
              />
            </div>
            
            <div className="form-field">
              <Input
                label="Confirmar contraseña"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repita su contraseña"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                fullWidth
              />
            </div>
            
            <div className="form-terms">
              <p>
                Al registrarte, aceptas nuestros <a href="#">Términos y Condiciones</a> y 
                nuestra <a href="#">Política de Privacidad</a>.
              </p>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            variant="text" 
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterForm; 