# gitlab 保护分支

## 问题

```bash
git push origin master:master -f ## remote: GitLab: You are not allowed to force push code to a protected branch on this project.
```

`GitLab: You are not allowed to force push code to a protected branch on this project.` 表示gitlab不允许你`强制`推送代码到被保护的分支

## 官方说明

> By default, a protected branch does four simple things:

- it prevents its creation, if not already created, from everybody except userswith Master permission
- it prevents pushes from everybody except users with Master permission
- it prevents anyone from force pushing to the branch
- it prevents anyone from deleting the branch

## 简单说明

开发者虽然是 Master 权限,有权限能够把代码推送到被保护分支，但是被保护的分支不允许`强制`推送.

正确的处理逻辑应该是：优先 `git pull` 拉取远程分支最新代码，然后再将代码，`git push origin master` 推送上去。（但是往往出现这个问题的人，这并不是他想要的操作，他就是要能够忽略远程，强制推送。）

## 解决方法

1. 取消分支保护
2. 代码强制推送到远程
3. 重新分支保护

代码参考：
（分支保护可直接调用gitlab服务api接口修改）

```javascript
/**
 * 底层调用 GIT 接口
 * @param gitServer git服务
 * @param type 请求类型
 * @param url 请求地址
 * @param resolveFullResponse 是否返回完整response对象
 */
export async function gitAPI(gitServer, type, url, resolveFullResponse = false) {
    var _include_Response = function (body, response) {
        if (resolveFullResponse) {
            return response
        }
        return body
    };
    return await request[type](`http://${gitServer}/api/v4/${url}${url.indexOf("?") >= 0 ? "&" : "?"}private_token=${configs.gitAuthServers[gitServer]}`, {
        json: true,
        transform: _include_Response
    })
}


/** 分支保护 */
export async function protectBranch(gitServer, gitProject, branchName) {
    return await gitAPI(gitServer, "put", `projects/${gitProject.id}/repository/branches/${branchName}/protect`)
}

/** 取消分支保护 */
export async function unprotectBranch(gitServer, gitProject, branchName) {
    return await gitAPI(gitServer, "put", `projects/${gitProject.id}/repository/branches/${branchName}/unprotect`)
}
```

## 最后

一般而言 `--force` 强制推送是比较危险的操作，但是在开发基础服务或工程化平台时必须强制推送,这时只能去查阅gitLab底层api文档，看看官方说明，一般都能找到解决办法。
