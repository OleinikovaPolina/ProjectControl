import { Component, Vue } from 'vue-property-decorator'

interface RulesInterface {
  string: Array<(val: string) => boolean | string>;
  array: Array<(val: Array<string>) => boolean | string>;
  confirm?: Array<(val: string) => boolean | string>;
}

@Component
export default class FormMixin extends Vue {
  public rules: RulesInterface = {
    string: [
      (val: string) => (val || '').length > 0 || 'This field is required',
    ],
    array: [
      (val: Array<string>) =>
        (val || []).length > 0 || 'This field is required',
    ]
  };

  $refs!: {
    form: HTMLFormElement;
    form0: HTMLFormElement;
    form1: HTMLFormElement;
    form2: HTMLFormElement;
  };

  public customToolbar= [
    [{ 'header': [false, 1, 2, 3, 4, 5, 6, ] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'header': 1 }, { 'header': 2 }],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link'],
    ['clean'],
  ]
}