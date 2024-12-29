# Sésame, ouvre-toi

## Description

Votre ami a stocké un secret dans la configuration de son chargeur de démarrage. Il vous assure qu’il n’est pas possible de l’extraire car il faut connaître son mot de passe pour stopper l’autoboot et y accéder.

Vous débranchez le disque NVMe stockant son système d’exploitation, vous remarquez alors que la machine démarre dans une sorte de shell. Serez-vous trouver un moyen d’accéder à son secret ?

Note: sur cette machine, le pointeur d’instruction est initialisé à 0x00000000 au démarrage.

On vous fournit un dump de ce chargeur de démarrage, mais configuré avec le mot de passe FAKEPASSWORD et sans secrets.

Files : 
- bootloader.bin

Author:
- erdnaxe

## Writeup

The connection on TCP socket allow to access uBoot shell : 

```bash
nc 127.0.0.1 4000

U-Boot 2023.07.02 (Jul 11 2023 - 15:20:44 +0000)

DRAM:  24 MiB
Core:  41 devices, 10 uclasses, devicetree: board
Loading Environment from nowhere... OK
In:    pl011@9000000
Out:   pl011@9000000
Err:   pl011@9000000
Autoboot in 10 seconds
## Booting kernel from Legacy Image at 40200000 ...
   Image Name:   EFI Shell
   Created:      1980-01-01   0:00:00 UTC
   Image Type:   AArch64 EFI Firmware Kernel Image (no loading done) (uncompressed)
   Data Size:    1028096 Bytes = 1004 KiB
   Load Address: 00000000
   Entry Point:  00000000
   Verifying Checksum ... OK
   XIP Kernel Image (no loading done)

No EFI system partition
No EFI system partition
Failed to persist EFI variables
## Transferring control to EFI (at address 40200040) ...
Booting /MemoryMapped(0x0,0x40200040,0xfb000)

UEFI Interactive Shell v2.2
EDK II
UEFI v2.100 (Das U-Boot, 0x20230700)
map: No mapping found.
Shell> 
``` 

We can run commands following 

```bash
Shell> help
acpiview      - Display ACPI Table information.
alias         - Displays, creates, or deletes UEFI Shell aliases.
attrib        - Displays or modifies the attributes of files or directories.
bcfg          - Manages the boot and driver options that are stored in NVRAM.
cd            - Displays or changes the current directory.
cls           - Clears the console output and optionally changes the background and foreground color.
comp          - Compares the contents of two files on a byte-for-byte basis.
connect       - Binds a driver to a specific device and starts the driver.
cp            - Copies one or more files or directories to another location.
date          - Displays and sets the current date for the system.
dblk          - Displays one or more blocks from a block device.
devices       - Displays the list of devices managed by UEFI drivers.
devtree       - Displays the UEFI Driver Model compliant device tree.
dh            - Displays the device handles in the UEFI environment.
disconnect    - Disconnects one or more drivers from the specified devices.
dmem          - Displays the contents of system or device memory.
dmpstore      - Manages all UEFI variables.
drivers       - Displays the UEFI driver list.
drvcfg        - Invokes the driver configuration.
drvdiag       - Invokes the Driver Diagnostics Protocol.
echo          - Controls script file command echoing or displays a message.
edit          - Provides a full screen text editor for ASCII or UCS-2 files.
eficompress   - Compresses a file using UEFI Compression Algorithm.
efidecompress - Decompresses a file using UEFI Decompression Algorithm.
else          - Identifies the code executed when 'if' is FALSE.
endfor        - Ends a 'for' loop.
endif         - Ends the block of a script controlled by an 'if' statement.
exit          - Exits the UEFI Shell or the current script.
for           - Starts a loop based on 'for' syntax.
getmtc        - Gets the MTC from BootServices and displays it.
goto          - Moves around the point of execution in a script.
Shell>        - Displays the UEFI Shell command list or verbose command help.
hexedit       - Provides a full screen hex editor for files, block devices, or memory.
if            - Executes commands in specified conditions.
ifconfig      - Modifies the default IP address of the UEFI IPv4 Network Stack.
ifconfig6     - Displays or modifies IPv6 configuration for network interface.
load          - Loads a UEFI driver into memory.
loadpcirom    - Loads a PCI Option ROM.
ls            - Lists the contents of a directory or file information.
map           - Displays or defines file system mappings.
memmap        - Displays the memory map maintained by the UEFI environment.
mkdir         - Creates one or more new directories.
mm            - Displays or modifies MEM/MMIO/IO/PCI/PCIE address space.
mode          - Displays or changes the console output device mode.
mv            - Moves one or more files to a destination within or between file systems.
openinfo      - Displays the protocols and agents associated with a handle.
parse         - Retrieves a value from a standard format output file.
pause         - Pauses a script and waits for an operator to press a key.
pci           - Displays PCI device list or PCI function configuration space and PCIe extended
configuration space.
ping          - Ping the target host with an IPv4 stack.
ping6         - Ping a target machine with UEFI IPv6 network stack.
reconnect     - Reconnects drivers to the specific device.
reset         - Resets the system.
rm            - Deletes one or more files or directories.
sermode       - Sets serial port attributes.
set           - Displays or modifies UEFI Shell environment variables.
setsize       - Adjusts the size of a file.
setvar        - Displays or modifies a UEFI variable.
shift         - Shifts in-script parameter positions.
smbiosview    - Displays SMBIOS information.
stall         - Stalls the operation for a specified number of microseconds.
time          - Displays or sets the current time for the system.
timezone      - Displays or sets time zone information.
touch         - Updates the filename timestamp with the current system date and time.
type          - Sends the contents of a file to the standard output device.
unload        - Unloads a driver image that was already loaded.
ver           - Displays UEFI Firmware version information.
vol           - Displays or modifies information about a disk volume.

Help usage:help [cmd|pattern|special] [-usage] [-verbose] [-section name][-b]
``` 