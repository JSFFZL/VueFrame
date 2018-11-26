export default {
  name: 'inputVerify',
  methods: {
    verify (mode, value) {
      /**
       *   template
       *   <input type="text" v-model="phone" placeholder="请输入手机" @input="input('phone', phone)" />
       *   <span ref="phone">电话提示</span>
       *
       *   <input type="text" v-model="email" placeholder="请输入邮箱" @input="input('email', email)" />
       *   <span ref="email">邮箱提示</span>
       *
       *   methods:
       *   this.verify(mode, value)
       *
      */
      const task = [
        {
          mode: 'phone',
          re: /^1\d{10}$/,
          prompt: '电话格式输入错误'
        },
        {
          mode: 'email',
          re: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
          prompt: '邮箱格式输入错误'
        }
      ]

      for (let item of task) {
        if (item.mode === mode) {
          return {
            isSuccess: item.re.test(value),
            isPrompt: item.re.test(value) ? null : item.prompt,
            mode: item.mode
          }
        }
      }
    }
  }
}
