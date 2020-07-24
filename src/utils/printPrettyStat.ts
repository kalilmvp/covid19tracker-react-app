import numeral from 'numeral';

export const printPrettyStat = (stat: number) => {
  return stat ? `+${numeral(stat).format('0.0a')}` : numeral(0).format('0.0a')
}