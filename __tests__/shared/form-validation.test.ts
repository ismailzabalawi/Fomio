/**
 * Unit tests for form validation utility
 */

import {
  validationRules,
  formValidationManager,
} from '../../shared/form-validation';

describe('Form Validation', () => {
  describe('validationRules', () => {
    describe('required', () => {
      const rule = validationRules.required();

      it('should validate non-empty strings', async () => {
        expect(await rule.validator('test')).toBe(true);
        expect(await rule.validator('hello world')).toBe(true);
      });

      it('should reject empty strings', async () => {
        expect(await rule.validator('')).toBe(false);
        expect(await rule.validator('   ')).toBe(false);
      });

      it('should reject null and undefined', async () => {
        expect(await rule.validator(null)).toBe(false);
        expect(await rule.validator(undefined)).toBe(false);
      });

      it('should validate non-empty arrays', async () => {
        expect(await rule.validator(['item'])).toBe(true);
      });

      it('should reject empty arrays', async () => {
        expect(await rule.validator([])).toBe(false);
      });
    });

    describe('email', () => {
      const rule = validationRules.email();

      it('should validate correct email formats', async () => {
        expect(await rule.validator('test@example.com')).toBe(true);
        expect(await rule.validator('user.name@domain.co.uk')).toBe(true);
        expect(await rule.validator('user+tag@example.org')).toBe(true);
      });

      it('should reject invalid email formats', async () => {
        expect(await rule.validator('invalid-email')).toBe(false);
        expect(await rule.validator('test@')).toBe(false);
        expect(await rule.validator('@example.com')).toBe(false);
        expect(await rule.validator('test.example.com')).toBe(false);
      });

      it('should allow empty values when not required', async () => {
        expect(await rule.validator('')).toBe(true);
        expect(await rule.validator(null)).toBe(true);
        expect(await rule.validator(undefined)).toBe(true);
      });
    });

    describe('minLength', () => {
      const rule = validationRules.minLength(5);

      it('should validate strings meeting minimum length', async () => {
        expect(await rule.validator('12345')).toBe(true);
        expect(await rule.validator('123456')).toBe(true);
      });

      it('should reject strings below minimum length', async () => {
        expect(await rule.validator('1234')).toBe(false);
        expect(await rule.validator('123')).toBe(false);
      });

      it('should allow empty values when not required', async () => {
        expect(await rule.validator('')).toBe(true);
        expect(await rule.validator(null)).toBe(true);
      });
    });

    describe('maxLength', () => {
      const rule = validationRules.maxLength(10);

      it('should validate strings within maximum length', async () => {
        expect(await rule.validator('12345')).toBe(true);
        expect(await rule.validator('1234567890')).toBe(true);
      });

      it('should reject strings exceeding maximum length', async () => {
        expect(await rule.validator('12345678901')).toBe(false);
        expect(await rule.validator('123456789012345')).toBe(false);
      });

      it('should allow empty values when not required', async () => {
        expect(await rule.validator('')).toBe(true);
      });
    });

    describe('pattern', () => {
      const rule = validationRules.pattern(/^[A-Z][a-z]+$/);

      it('should validate strings matching pattern', async () => {
        expect(await rule.validator('Hello')).toBe(true);
        expect(await rule.validator('World')).toBe(true);
      });

      it('should reject strings not matching pattern', async () => {
        expect(await rule.validator('hello')).toBe(false);
        expect(await rule.validator('HELLO')).toBe(false);
        expect(await rule.validator('Hello123')).toBe(false);
      });

      it('should allow empty values when not required', async () => {
        expect(await rule.validator('')).toBe(true);
      });
    });

    describe('passwordStrength', () => {
      const rule = validationRules.passwordStrength();

      it('should validate strong passwords', async () => {
        expect(await rule.validator('Password123')).toBe(true);
        expect(await rule.validator('MySecure1Pass')).toBe(true);
      });

      it('should reject weak passwords', async () => {
        expect(await rule.validator('password')).toBe(false); // No uppercase or numbers
        expect(await rule.validator('PASSWORD')).toBe(false); // No lowercase or numbers
        expect(await rule.validator('12345678')).toBe(false); // No letters
        expect(await rule.validator('Pass1')).toBe(false); // Too short
      });

      it('should allow empty values when not required', async () => {
        expect(await rule.validator('')).toBe(true);
      });
    });

    describe('confirmPassword', () => {
      const rule = validationRules.confirmPassword('password');

      it('should validate matching passwords', async () => {
        const formData = { password: 'test123' };
        expect(await rule.validator('test123', formData)).toBe(true);
      });

      it('should reject non-matching passwords', async () => {
        const formData = { password: 'test123' };
        expect(await rule.validator('different', formData)).toBe(false);
      });

      it('should allow empty values when not required', async () => {
        expect(await rule.validator('')).toBe(true);
        expect(await rule.validator('', {})).toBe(true);
      });
    });

    describe('username', () => {
      const rule = validationRules.username();

      it('should validate correct usernames', async () => {
        expect(await rule.validator('user123')).toBe(true);
        expect(await rule.validator('test_user')).toBe(true);
        expect(await rule.validator('User_Name_123')).toBe(true);
      });

      it('should reject invalid usernames', async () => {
        expect(await rule.validator('us')).toBe(false); // Too short
        expect(await rule.validator('a'.repeat(21))).toBe(false); // Too long
        expect(await rule.validator('user-name')).toBe(false); // Invalid character
        expect(await rule.validator('user name')).toBe(false); // Space
        expect(await rule.validator('user@name')).toBe(false); // Special character
      });

      it('should allow empty values when not required', async () => {
        expect(await rule.validator('')).toBe(true);
      });
    });

    describe('url', () => {
      const rule = validationRules.url();

      it('should validate correct URLs', async () => {
        expect(await rule.validator('https://example.com')).toBe(true);
        expect(await rule.validator('http://test.org')).toBe(true);
        expect(await rule.validator('https://sub.domain.com/path')).toBe(true);
      });

      it('should reject invalid URLs', async () => {
        expect(await rule.validator('not-a-url')).toBe(false);
        expect(await rule.validator('ftp://example.com')).toBe(false);
        expect(await rule.validator('example.com')).toBe(false);
      });

      it('should allow empty values when not required', async () => {
        expect(await rule.validator('')).toBe(true);
      });
    });
  });

  describe('FormValidationManager', () => {
    describe('validateField', () => {
      it('should validate field with single rule', async () => {
        const rules = [validationRules.required()];
        const result = await formValidationManager.validateField(
          'test',
          'value',
          rules
        );

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should return errors for invalid field', async () => {
        const rules = [validationRules.required()];
        const result = await formValidationManager.validateField(
          'test',
          '',
          rules
        );

        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toBe('This field is required');
      });

      it('should validate field with multiple rules', async () => {
        const rules = [
          validationRules.required(),
          validationRules.minLength(5),
          validationRules.email(),
        ];
        const result = await formValidationManager.validateField(
          'email',
          'test@example.com',
          rules
        );

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should return multiple errors for invalid field', async () => {
        const rules = [
          validationRules.required(),
          validationRules.minLength(10),
          validationRules.email(),
        ];
        const result = await formValidationManager.validateField(
          'email',
          'test',
          rules
        );

        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(1);
      });
    });

    describe('validateForm', () => {
      it('should validate entire form', async () => {
        const formData = {
          email: 'test@example.com',
          password: 'Password123',
          username: 'testuser',
        };

        const fieldRules = {
          email: [validationRules.required(), validationRules.email()],
          password: [
            validationRules.required(),
            validationRules.passwordStrength(),
          ],
          username: [validationRules.required(), validationRules.username()],
        };

        const result = await formValidationManager.validateForm(
          formData,
          fieldRules
        );

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
        expect(Object.keys(result.fields)).toHaveLength(3);
      });

      it('should return errors for invalid form', async () => {
        const formData = {
          email: 'invalid-email',
          password: 'weak',
          username: 'x',
        };

        const fieldRules = {
          email: [validationRules.required(), validationRules.email()],
          password: [
            validationRules.required(),
            validationRules.passwordStrength(),
          ],
          username: [validationRules.required(), validationRules.username()],
        };

        const result = await formValidationManager.validateForm(
          formData,
          fieldRules
        );

        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.fields.email.isValid).toBe(false);
        expect(result.fields.password.isValid).toBe(false);
        expect(result.fields.username.isValid).toBe(false);
      });
    });
  });
});
