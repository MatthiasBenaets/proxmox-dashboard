# Proxmox Dashboard

A dumbed down version of the Proxmox Dashboard.
It makes it easier for a general user to manage and access a virtual machine or lxc on the Proxmox server.

## Features

Note that the current capabilities are very opinionated to what I think a normal user should be allowed to do.

- Datacenter & Node
  - Live overview of all LXC/VM statistics
- LXC & VM
  - Actions
    - Start - Stop - Reboot - Delete
  - Live LXC/VM specific statistics
  - Task/history log
  - Xterm.js & noVNC remote connection
  - Template cloning to active LXC/VM
- Authentications using PVE
