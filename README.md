# Bug Admin
# 推荐：用 pipx 安装命令行工具（隔离干净）
python -m pip install --user pipx
python -m pipx ensurepath
# 关闭并重新打开终端后执行：
pipx install commitizen
cz --version

# 交互式规范提交（有向导）
cz commit              # 或 cz c

# 校验最近一次提交是否符合规范
cz check

# 按提交记录自动升级版本、打 tag、更新 CHANGELOG（你的 cz.yaml 已开启）
cz bump --yes

# 若需要单独更新/生成 CHANGELOG（可选）
cz changelog

# 推送代码与标签
git push
git push --tags        # 或 git push --follow-tags