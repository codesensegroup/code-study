module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 將 body 每行最大長度從 100 改為 200 字元,適應 AI 生成的 commit message
    'body-max-line-length': [2, 'always', 200],
    // 放寬 header 長度限制
    'header-max-length': [2, 'always', 150]
  }
}
