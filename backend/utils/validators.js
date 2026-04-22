function pickErrors(body, rules) {
  const errors = [];
  for (const [key, rule] of Object.entries(rules)) {
    const v = body[key];
    if (rule.required && (v === undefined || v === null || String(v).trim() === '')) {
      errors.push(`${key} is required`);
    }
    if (v !== undefined && v !== null && rule.type === 'email' && String(v).trim()) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
      if (!ok) errors.push(`${key} must be a valid email`);
    }
    if (v !== undefined && v !== null && rule.minLength && String(v).length < rule.minLength) {
      errors.push(`${key} must be at least ${rule.minLength} characters`);
    }
  }
  return errors;
}

function parsePositiveInt(value, label = 'id') {
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n < 1) {
    return { error: `Invalid ${label}` };
  }
  return { value: n };
}

module.exports = { pickErrors, parsePositiveInt };
