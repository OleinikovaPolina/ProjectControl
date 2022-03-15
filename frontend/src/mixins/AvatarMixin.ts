import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AvatarMixin extends Vue {
  public getColor(str: string): string {
    return '#' + intToRGB(hashCode(str))
  }

  public initials(name: string): string {
    return name
      .split(' ')
      .map((w, i) => (i == 0 || i == 1 ? w.substring(0, 1).toUpperCase() : ''))
      .join('')
  }
}

function hashCode(str = ''): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash
}

function intToRGB(i: number): string {
  const c = (i & 0x00ffffff).toString(16).toUpperCase()
  return '00000'.substring(0, 6 - c.length) + c
}
