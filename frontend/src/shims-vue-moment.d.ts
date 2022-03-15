import { Moment, MomentFormatSpecification, MomentInput, Duration, DurationInputArg2, DurationInputArg1 } from 'moment'
import { PluginObject } from 'vue'

declare namespace VueMomentPlugin {
  interface Options {
    moment?: Moment | undefined;
  }

  interface VueStatic extends Moment {
    (options: Options): void;
    (inp?: MomentInput, format?: MomentFormatSpecification, strict?: boolean): Moment;
    (inp?: MomentInput, format?: MomentFormatSpecification, language?: string, strict?: boolean): Moment;
    duration(inp?: DurationInputArg1, unit?: DurationInputArg2): Duration;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $moment: VueMomentPlugin.VueStatic;
  }
}

type VueMoment = PluginObject<undefined>

declare const VueMoment: VueMoment
export = VueMoment;