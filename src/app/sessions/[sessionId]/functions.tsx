import { IGenerateDataRolls, IMsn } from "@/interface";

export const generateDataRoll = (msn: IMsn): IGenerateDataRolls => {
  let success = 0;
  let fail = 0;
  let brutal = 0;
  let critical = 0;

  if (msn.rollOfRage) {
    for (let i = 0; i < msn.rollOfRage.length; i += 1) {
      if (Number(Number(msn.rollOfRage[i])) === 10) {
        critical += 1;
      } else if (Number(msn.rollOfRage[i]) > 2 && Number(msn.rollOfRage[i]) < 6) {
        fail += 1;
      } else if (Number(msn.rollOfRage[i]) > 5 && Number(msn.rollOfRage[i]) < 10) {
        success += 1;
      } else {
        brutal += 1;
      }
    }
  }

  if (msn.rollOfMargin) {
    for (let i = 0; i < msn.rollOfMargin.length; i += 1) {
      if (Number(msn.rollOfMargin[i]) === 10) {
        critical += 1;
      } else if (Number(msn.rollOfMargin[i]) > 2 && Number(msn.rollOfMargin[i]) < 6) {
        fail += 1;
      } else if (Number(msn.rollOfMargin[i]) > 5 && Number(msn.rollOfMargin[i]) < 10) {
        success += 1;
      } else {
        fail += 1;
      }
    }
  }

  let paresBrutais = 0;
  let paresCriticals = 0;
  if (brutal % 2 !== 0) {
    brutal -= 1;
  }
  paresBrutais = brutal * 2;

  if (critical % 2 !== 0 && critical !== 1) {
    critical -= 1;
    success += 1;
  }

  if (critical > 1) {
    paresCriticals = critical * 2
  } else {
    paresCriticals = critical;
  }

  let sucessosParaDano = paresBrutais + paresCriticals + success - Number(msn.dificulty);
  const falhaBrutal: boolean = brutal > 1;
  if (sucessosParaDano === 0) sucessosParaDano += 1;

  return {
    falhaBrutal,
    success,
    fail,
    brutal,
    critical,
    sucessosParaDano,
    paresBrutais,
    paresCriticals,
  }
};