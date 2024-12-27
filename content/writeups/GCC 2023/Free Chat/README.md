---
description: GCC CTF 2024 - @Mika https://twitter.com/bWlrYQ
---

# Free Chat

![Banner](images/banner.png)

The author seems to insist that the application runs on Debian 12, something we'll keep in the back of our minds.

The application's response headers show that we're on a Python backend using the Werkzeug framework.

```bash
Server: Werkzeug/3.0.1 Python/3.11.2
```

When you get to the page, you can log in or create an account. Once logged in, you have access to a chat window, which doesn't seem to be sensitive to XSS or SSTI.

![Chat](images/chat.png)

When you go to your account settings, you can rename yourself or change your avatar.

This can be done by : 

* uploading a file,
* via a remote URL (which is quite uncommon, but we'll come back to this later)

![ChangeAvatar](images/change_avatar.png)

To load and display our profile photo, the front-end performs the following query:

* [http://worker05.gcc-ctf.com:13265/pfp?name=default.png](http://worker05.gcc-ctf.com:13265/pfp?name=default.png)

![meme](images/meme.png)

## Arbitrary file read

This mechanism can be abused to perform an arbitrary file read on the server; a small bypass of the non-recursive replace() :

![etcpasswd](images/etc_passwd.png)

The next steps consist in looting files on the server in search of the flag or other information that will enable us to progress on the challenge. For example, we can read /proc/self/cmdline, which contains the command that launched our process program:

```bash
python3 app.py
```

We can also read /proc/self/environ, which contains our program's environment variables:

```bash
HOSTNAME=freechat PWD=/freechat HOME=/home/freechat SHLVL=0 PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin OLDPWD=/var/www/fr33chat_d3v_right.local _=/usr/bin/python3
```

Here we discover that our current folder (PWD) is /freechat and that the folder we were previously in (OLDPWD) is /var/www/fr33chat_d3v_right.local. So there are certainly 2 applications running on the server.

![src_app](images/src_app.png)

The application sources we've managed to recover seem very minimalist, using python and the Flask template engine. 

We manage to read the templates/index.html file:

![index_src](images/index_src.png)

This application seems to run internally under the hostname "devpanel" on port 8000. However, it seems that a token is required to access it. Another file is readable: "hint.js" which contains a small hint to progress on the challenge:

```javascript
function hint(){
    document.getElementById("hint").innerHTML = "<h5>Hint: Don't be stupid admin, if you've lost the <b>token</b> you can still <b>locate</b> it. Just think!</h5>"
}
```

This hint seems to insist about 'locate' ...

## Locate - Linux

Locate allows you to find a file on a Linux file system. Unlike the find command, locate will give you the search result immediately. 

If you're not perfectly familiar with locate under Linux, you can refer to the following documentation:

* [https://doc.ubuntu-fr.org/locate](https://doc.ubuntu-fr.org/locate)

The doc also tells us something very interesting:

> locate is fast because, instead of browsing the entire system tree "live" (as find does), a database is regularly updated, containing a list of all files and directories. It is this static index that will be explored very quickly and provide the search result when using locate.

This tool is also very powerful, as it indexes all files in a database.

Example :

```
» time locate passwd 
/etc/pam.d/chpasswd
/etc/pam.d/passwd
/etc/passwd
/etc/passwd-
/etc/security/opasswd
/opt/tools/impacket/build/lib/impacket/krb5/kpasswd.py
/opt/tools/impacket/build/scripts-3.10/changepasswd.py
/opt/tools/impacket/build/scripts-3.10/smbpasswd.py
... too long ...
/var/lib/dpkg/info/passwd.preinst
/var/lib/dpkg/info/passwd.prerm

locate passwd  0,41s user 0,01s system 99% cpu 0,426 total
--------------------------------------------------------------
``` 

So, if you have access to this database, you'll know the path to all the files on your disk, and perhaps your precious token.

![google_search](images/google_search.png)

We use our arbitrary file read to download this database :

![read_db](images/read_db.png)

The DB in question has been retrieved, and can be parsed with `locate.findutils`.

```bash
» /usr/bin/locate.findutils --database='locatedb' '*'
```

You can find some interesting things by grep with certain keywords:

![grep_locate](images/grep_locate.png)

We see an interesting file in our current user directory:

- /home/freechat/.for_d3vs_0nly/access_token.txt

We've got our token!

![read_token](images/read_token.png)

It's cool, but what can you do with it?

## SSRF - Basic HTTP Authentication abuse

As we saw earlier, the application lets you update your profile photo by uploading it from a remote URL. However, we come up against a restriction: the application only authorizes loading on a URL that begins with `http(s)://pbs.twimg.com`

![restriction_domaine](images/restriction_domaine.png)

A trained eye will notice that the URL is incomplete. As the RFC indicates, a valid URL ends with a `/` :

* [https://rgxdb.com/r/2MQXJD5](https://rgxdb.com/r/2MQXJD5)

In our case, this detail can be very interesting, as it allows us to control part, or even all, of the domain name.

There are several ways to exploit this vulnerability:

* We can register a sub-domain `pbs.twimg.com.pouet.com` to redirect (DNS or 302) the request to the domain of our choice,
* Abuse the HTTP authentication mechanism.

Here I'm going to use the second solution. HTTP authentication can be performed using the following syntax: `https://user:password@example.com/`.

* [https://developer.mozilla.org/fr/docs/Web/HTTP/Authentication#acc%C3%A8s\_avec\_identifiants\_dans\_lurl](https://developer.mozilla.org/fr/docs/Web/HTTP/Authentication#acc%C3%A8s\_avec\_identifiants\_dans\_lurl)

![auth](images/auth.png)

In our case, we'll use "`pbs.twimg.com`" as Basic Auth identifiers, then specify a `@` to point to the domain of our choice. This results in :

* [https://pbs.twimg.com@tmjg1d2obxvzkyui3z4zae8e75dw1npc.oastify.com](https://pbs.twimg.com@tmjg1d2obxvzkyui3z4zae8e75dw1npc.oastify.com)

And indeed we receive a request from the back-end.

![ssrf](images/ssrf.png)

We can therefore tap on external domains, as well as internal ones, including the previous devpanel:8000 application, specifying the required token in GET parameter.

* [http://pbs.twimg.com@devpanel:8000/?token=af33aa8342e212020e0ba08bca94e3559f82d3efb0eb7ec6e7eafbc11710f05b](http://pbs.twimg.com@devpanel:8000/?token=af33aa8342e212020e0ba08bca94e3559f82d3efb0eb7ec6e7eafbc11710f05b)

![output](images/output.png)

We decode the string in base64 and recover the flag :

![flag](images/flag.png)

Thanks [@Mika](https://twitter.com/bWlrYQ) for this challenge with cool tricks <3
