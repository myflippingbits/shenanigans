# Create a Repo

Make sure there is at least one file in it (even just the README)

Generate ssh key:

``` text
ssh-keygen -t rsa -C "your_email@example.com"
```

Copy the contents of the file ~/.ssh/id_rsa.pub to your SSH keys in your GitHub account settings.

start agent:

``` text
eval $(ssh-agent)
```

Add your keys:

``` text
ssh-add ~/.ssh/id_rsa
```

Test SSH key:

``` text
ssh -T git@github.com
```

clone the repo: (this will clone the repo to the directory you are currently in)

``` text
git clone git://github.com/username/your-repository
```

Now cd to your git clone folder and do:

``` text
git remote set-url origin git@github.com:username/your-repository.git
git remote set-url origin ssh://git@github.com/username/repo-name.git
```

Now try editing a file (try the README) and then do:

``` text
git add -A
git commit -am "my update msg"
git push
```