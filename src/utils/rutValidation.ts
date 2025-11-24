export function validateRUT(rut: string) : boolean {
    if (!rut) return false;
  
    const limpio = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
  
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
  
    if (!/^\d+$/.test(cuerpo)) return false;
  
    let suma = 0;
    let multiplicador = 2;
  
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i], 10) * multiplicador;
      multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
    }
  
    const resto = suma % 11;
    const dvEsperado = resto === 0 ? '0' : resto === 1 ? 'K' : String(11 - resto);
  
    return dv === dvEsperado;
  }
  