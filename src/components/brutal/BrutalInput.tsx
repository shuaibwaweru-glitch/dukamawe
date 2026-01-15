// src/components/brutal/BrutalInput.tsx
import React from 'react';

interface BrutalInputProps {
  /** Input label (optional) */
  label?: string;
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'url';
  /** Placeholder text */
  placeholder?: string;
  /** Input value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Error message */
  error?: string;
  /** Required field */
  required?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Brutal Input Component
 * 
 * A bold input field with thick borders and shadow effects.
 * 
 * @example
 * ```tsx
 * <BrutalInput
 *   label="PHONE NUMBER"
 *   type="tel"
 *   value={phone}
 *   onChange={setPhone}
 *   placeholder="0712 345 678"
 *   error={errors.phone}
 * />
 * ```
 */
export const BrutalInput: React.FC<BrutalInputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  required = false,
  className = ''
}) => {
  return (
    <div className="form-group-brutal">
      {label && (
        <label className="label-brutal">
          {label}
          {required && <span style={{ color: '#FF0000', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        className={`input-brutal ${error ? 'error' : ''} ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
      />
      {error && (
        <div className="error-message-brutal">
          <span>⚠</span>
          {error}
        </div>
      )}
    </div>
  );
};

interface BrutalTextareaProps {
  /** Textarea label (optional) */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Textarea value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Error message */
  error?: string;
  /** Number of rows */
  rows?: number;
  /** Required field */
  required?: boolean;
}

/**
 * Brutal Textarea Component
 * 
 * A bold textarea with thick borders and shadow effects.
 */
export const BrutalTextarea: React.FC<BrutalTextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  rows = 4,
  required = false
}) => {
  return (
    <div className="form-group-brutal">
      {label && (
        <label className="label-brutal">
          {label}
          {required && <span style={{ color: '#FF0000', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <textarea
        className={`input-brutal ${error ? 'error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={rows}
        required={required}
      />
      {error && (
        <div className="error-message-brutal">
          <span>⚠</span>
          {error}
        </div>
      )}
    </div>
  );
};

interface BrutalSelectProps {
  /** Select label (optional) */
  label?: string;
  /** Select value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Select options */
  options: Array<{ value: string; label: string }>;
  /** Placeholder option */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Error message */
  error?: string;
  /** Required field */
  required?: boolean;
}

/**
 * Brutal Select Component
 * 
 * A bold select dropdown with thick borders and shadow effects.
 */
export const BrutalSelect: React.FC<BrutalSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  error,
  required = false
}) => {
  return (
    <div className="form-group-brutal">
      {label && (
        <label className="label-brutal">
          {label}
          {required && <span style={{ color: '#FF0000', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <select
        className={`input-brutal ${error ? 'error' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="error-message-brutal">
          <span>⚠</span>
          {error}
        </div>
      )}
    </div>
  );
};

export default BrutalInput;