export const convertInToMm = (in_ent: string, in_num: string, in_den: string) => {
  const ent = parseInt(in_ent);
  const num = parseInt(in_num);
  const den = parseInt(in_den);

  let val = 0;
  let ok = false;
  if (num > 0 && den > 0) {
    val += num / den;
    ok = true;
  }
  if (ent > 0) {
    val += ent;
    ok = true;
  }
  if (ok) {
    return Math.round(val * 100 * 25.4) / 100;
  } else {
    return null;
  }
};

const fractionItems = (value: number) => {
  const precisionPo = 32;
  const entier = parseInt(value.toString());
  const reste = value - entier;
  if (reste == 0) {
    return [entier, 0, 0];
  }
  let h = Math.round(reste * precisionPo);
  if (h == precisionPo) {
    return [entier + 1, 0, 0];
  }
  if (h == 0) {
    return [entier, 0, 0];
  }
  let b = precisionPo;
  let divOk = true;
  while (divOk) {
    if (h % 2 == 0 && b % 2 == 0) {
      h = h / 2;
      b = b / 2;
    } else {
      divOk = false;
    }
  }
  if (entier > 0) {
    return [entier, h, b];
  } else {
    return [0, h, b];
  }
};

export const convertMmToIn = (mm_o: string) => {
  const valMm = parseFloat(mm_o);

  let val = 0;
  let ok = false;
  if (valMm > 0) {
    val = valMm * 0.0393700787;
    ok = true;
  }

  let in_ent;
  let in_numb;
  let in_den;

  if (ok) {
    const fractItems = fractionItems(val);
    in_ent = fractItems[0];
    if (fractItems[1] > 0) {
      in_numb = fractItems[1];
      in_den = fractItems[2];
    } else {
      in_numb = null;
      in_den = null;
    }
  } else {
    in_ent = null;
    in_numb = null;
    in_den = null;
  }
  return [in_ent, in_numb, in_den];
};

export const convertMmToInFormatted = (value: string) => {
  const conversion = convertMmToIn(value);
  if (conversion[1] || conversion[2]) {
    return `${conversion[0]}" ${conversion[1]}/${conversion[2]}`;
  } else {
    return `${conversion[0]}"`;
  }
};

export const convertInToMmFormatted = (value: string) => {
  const formattedValue = value.trim().replace(' ', '/').replace('" ', '"').replace('"', '/');
  const valueSplit = formattedValue.split('/');
  const list = valueSplit.filter((f: string) => f !== '');
  return convertInToMm(list[0], list[1] || '', list[2] || '');
};
