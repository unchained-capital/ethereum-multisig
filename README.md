No Longer Supported
=================
This project is no longer supported or upkept by Unchained Capital. Please use this project at your own risk.

Ethereum Multisig
=================

<img src="https://raw.githubusercontent.com/unchained-capital/ethereum-multisig/master/audit/HoshoSecured_Emblem_Red.png" width="150px">

This repository implements an Ethereum smart contract
(`Multisig2of3`) which requires signed messages from 2/3 members
of a multisig cold wallet with individual keys stored on
[Trezor] or [Ledger] hardware wallets.

This repository also contains a simple dApp which lets you create and
spend from an instance of the smart contract using your own quorum of
Trezors.  You can run the dApp locally or via our hosted copy at
https://ethereum-multisig.unchained-capital.com.

Command-line scripts are also provided (see the `scripts` directory)
for developers who want to create and spend from the smart contract
programatically.

The smart contract is fully unit tested.

Why did we write this contract?
-------------------------------

For complete details on why we wrote this contract, please read our
[blog post].

In short, we needed an Ethereum multisig smart contract with the
following properties:

* allows anyone to deposit Ether
* can only be spent by passing signed messages from M out of N private keys
* compatible with signing semantics of hardware devices (such as Trezors)
* can be initially broadcast from a hot wallet not in the M/N-quorum
* can be spent by this same hot wallet relaying messages from the M/N-quorum
* remains secure if the hot wallet broadcasting the contract is compromised
* as simple as possible with no dependence on library code
* fully unit-tested and integration-tested on testnets (Kovan) as well
as the Ethereum mainnet
* well-documented and easy to use

In Bitcoin, all these requirements are trivially met by the standard
implementation of a 2/3 P2SH address.  Ethereum suffers from an
embarassment of riches and we could not find a single smart contract
implementation that we were happy with.  So we wrote this.

<a name="dapp">

Audit
-----

The [MultiSig2of3](contracts/MultiSig2of3.sol) contract was audited by [Hosho].  
We have included the
[full audit report](audit/hosho_f40143e.pdf).

The audit was of the contract at commit `f40143e00a378addfc5559ff743f1c8a7ca7fae3`
with a fingerprint of `4F436F84AB192BB664AEE206EB7ED80138481B46C9BBA7EC5C70C2774752CEDF`.

dApp
====

The simplest way to interact with the smart contract is through the
dApp bundled with this repository.  The dApp assumes you have a
locally running Ethereum client ([Parity], [MetaMask], [Geth], &c.)

Using Hosted dApp
-----------------

You can access a hosted version of the dApp at
https://ethereum-multisig.unchained-capital.com.  Depending on which
Ethereum node you are using, you may have to do some additional
configuration before the dApp can communicate:

* MetaMask -- No additional configuration is required
* Parity
  * if you are using Chrome, you can install the [Parity Chrome Extension]
  * otherwise you'll need to make sure you set
  `--jsonrpc-cors https://ethereum-multisig.unchained-capital.com`
  when starting Parity
* Geth
  * you'll need to set
  `--rpccorsdomain https://ethereum-multisig.unchained-capital.com`
  when starting geth.
* Mist -- [Mist does not support Trezor] so the dApp will not work.

Running Local dApp
------------------

To access the dApp locally, download or clone this repository.

Once downloaded you can use access the dApp in two ways:

1. Navigate with your browser to the file `public/index.html` inside
   this repository.  This option is easier but somewhat less secure.
2. Launch a local webserver and point your browser to
   https://localhost:8435.  This option is more secure but requires a
   local [NPM] installation and using the
   command-line -- see the [section below](#local-webserver) for
   instructions.

Which you choose will depend on which Ethereum node you are using and
how you've configured it:

* MetaMask -- For security reasons, option (1) is [not allowed][metamask file]
  by MetaMask -- you **must** use option (2) and launch a local webserver.
* Parity
  * To use option (1) and navigate with your browser to the file
    `public/index.html` you will need to set `--jsonrpc-cors null`
    (this is why this option is less secure).
  * To use option (2) and point your browser to
    `https://localhost:8435` you will need to set `--jsonrpc-cors
    https://localhost:8435`.
* Geth
  * To use option (1) and navigate with your browser to the file
    `public/index.html` you will need to set `--rpccorsdomain null`
    (this is why this option is less secure).
  * To use option (2) and point your browser to
    `https://localhost:8435` you will need to set `--rpccorsdomain
    https://localhost:8435`.    
* Mist -- [Mist does not support Trezor] so the dApp will not work.

<a name="local-webserver">

### Launching a Local Webserver

This repository also comes with a simple webserver which provides a
more secure alternative to directly browsing to the
`public/index.html` file.  (This is required for MetaMask and Ledger).

To launch the local webserver you will need
[NPM] to be installed locally as well as the
[make] program.

To install dependencies and launch the server, open a shell in this
repository's directory and run:

```
$ make dependencies
$ make server
```

Now browse to https://localhost:8435 to see the dApp. You will have to accept
an insecure connection warning.

Developers
==========

If you want to develop against the smart contract or the DAPP you'll
need:

* [make]
* [NPM]
* [Python 3] (only required for scripts)

You may also have to install some system dependencies:

* OS X -- run `brew install libusb leveldb`
* Ubuntu/Debian -- run `apt install python3-dev libusb-dev`

To install all development dependencies, open a shell in this
repository's directory and run:

```
$ make dependencies-all
```

If you aren't using the python scripts or mythril, you can skip the
python dependencies by running:

```
$ make js-dependencies-all
```

Compiling & Testing the Contract
--------------------------------

Once dependencies are installed, you can compile the contract.

```
$ make contract
```

and run its unit tests

```
$ make test
```

We are using the [Truffle framework] so
`truffle` commands are available.  To make them easier to run, you
should update your `PATH` variable or set a shell alias.  You can also just run

```
$ source environment.sh
```

to do all of this for you.  Now you can run the `truffle` commands, e.g. - 

```
$ truffle compile
```

### Myth

We are using the [Mythril] tool
for static analysis.  Once dependencies are installed, you can run:

```
$ make myth
```

to run a check.  You can also run the `myth` program directly
(assuming you have run `source environment.sh`).

### Solium

We use [Solium] for linting and
more security checks. Run with:

```
$ make solium
```


Events
------

The contract emits the following events:

* `Funded (uint256 newBalance)`  -- whenever the contract receives a new deposit
(topic: `0xc4c14883ae9fd8e26d5d59e3485ed29fd126d781d7e498a4ca5c54c8268e4936`)
* `Spent (address to, uint256 transfer)` -- whenever the contract is spent from
(topic: `0xd3eec71143c45f28685b24760ea218d476917aa0ac0392a55e5304cef40bd2b6`)

Command-Line Scripts
--------------------

This repository also comes with the command-line Python and Node scripts for
interacting with the smart contract:

* `scripts/export_ethereum_address` --
    exports an Ethereum address from a local Trezor.
* `scripts/ledger/ledger-address.js` --
    exports an Ethereum address from a local Ledger.
* `scripts/create_ethereum_multisig` --
    creates a new instance of the smart contract.
* `scripts/ethereum_multisig_spend_unsigned_data` --
    return the unsigned data used for a spend
* `scripts/export_ethereum_multisig_spend_signature` --
    export a signed spend from a local Trezor.
* `scripts/ledger/ledger-sign-message.js` --
    export a signed spend from a local Ledger.
* `scripts/spend_ethereum_multisig` -- broadcast a spend transaction

Once dependencies are installed, you will be able to run
these scripts.

The following example illustrates how to collectively use these
scripts and a **single** Trezor or Ledger to create an instance of the smart
contract and spend from it.  Using a single wallet is convenient for
testing, but for real usage you would obviously use distinct wallets.

1. The first step is to set the shell's environment to enter the
   Python [virtualenv]. You can do this by running `.virtualenv/bin/activate`
   directly or just source the environment setup script:

```
$ source environment.sh
```

2. Now extract three separate addresses which can act as signers for
   the smart contract:

```
$ owner_path_1="m/44'/60'/600'/0/0"
$ owner_path_2="m/44'/60'/600'/0/1"
$ owner_path_3="m/44'/60'/600'/0/2"
```

For Trezor:

```
$ owner_address_1=$(./scripts/export_ethereum_address $owner_path_1)
$ owner_address_2=$(./scripts/export_ethereum_address $owner_path_2)
$ owner_address_3=$(./scripts/export_ethereum_address $owner_path_3)
```

For Ledger:

To use ledger with node scripts (assuming you are using the standard
ethereum app) you will need to set 'Browser Support' to 'No' in the
'Settings' menu in the Ethereum app on the Ledger device.


```
$ owner_address_1=$(node scripts/ledger/ledger-address.js $owner_path_1)
$ owner_address_2=$(node scripts/ledger/ledger-address.js $owner_path_2)
$ owner_address_3=$(node scripts/ledger/ledger-address.js $owner_path_3)
```



3. Now use these addresses to create a new instance of the smart contract.

```
$ contract_address=$(./scripts/create_ethereum_multisig $owner_address_1 $owner_address_2 $owner_address_3)
```

4. Now you can fund the address using any Ethereum wallet.

5. To spend from the address, first compute the unsigned message
   required for the spend (sending 0.1 ETH to address
   `0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa` in this example):

```
$ destination_address=0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
$ amount=0.1
$ unsigned_data=$(./scripts/ethereum_multisig_spend_unsigned_data $contract_address $destination_address $amount)
```

6. Now export two signatures:

For Trezor:

```
$ signature_1=$(./scripts/export_ethereum_multisig_spend_signature $unsigned_data $owner_path_1)
$ signature_2=$(./scripts/export_ethereum_multisig_spend_signature $unsigned_data $owner_path_2)
```

For Ledger:

You can/should preview the message that will displayed:

```
$ node scripts/ledger/preview-ledger-display.js $unsigned_data
```

And then sign:

```
$ signature_1=$(node scripts/ledger/ledger-sign-message.js $owner_path_1 $unsigned_data)
$ signature_2=$(node scripts/ledger/ledger-sign-message.js $owner_path_2 $unsigned_data)
```

**Note:** The Ledger signature produced by this script has been altered to
match the same format as the Trezor signature. If using the 'manual input'
fields in the dapp with this signature, select 'Trezor' from the wallet
drop-down.



7. Now broadcast the spend transaction:

```
$ ./scripts/spend_ethereum_multisig $contract_address $destination_address $amount $signature_1 $signature_2
```

Contributing
------------

We welcome contributions to this repository either in form of GitHub
issues or pull requests.

When filing an issue, please include the context under which you
encountered the issue, e.g. - 

* "using the hosted dApp with Parity v1.8.0 using the Parity Chrome Extension
    on Windows 10 with Ledger firmware 1.4.2 and ethereum app version 1.0.20"
* "using the scripts on an Ubuntu 16.04 installation with Python version 3.6.0
    and Trezor firmware 1.6.0"

When contemplating a pull request, please consider fixing just a
single bug or implement just a single feature.  Before you submit the
pull request, ensure you have run the unit tests and run an
"integration test" using the dApp locally with a Trezor and/or Ledger.

Disclaimer
==========

This application is in “alpha” state and is presented for evaluation and
testing only. It is provided “as is,” and any express or implied warranties,
including but not limited to the implied warranties of merchantability and
fitness for a particular purpose, are disclaimed. By using this application,
you accept all risks of such use, including full responsibility for any direct
or indirect loss of any kind resulting from the use of this application, which
may involve complete loss of any ETH or other coins associated with addresses
used with this application. In no event shall Unchained Capital, Inc., its
employees and affiliates, or developers of this application be liable for
any direct, indirect, incidental, special, exemplary, or consequential
damages (including, but not limited to, procurement of substitute goods or
services; loss of use, data, or profits; or business interruption) however
caused and on any theory of liability, whether in contract, strict liability,
or tort (including negligence or otherwise) arising in any way out of the
use of this application, even if advised of the possibility of such damage.

[trezor]: https://trezor.io/
[ledger]: https://www.ledgerwallet.com/
[hosho]: https://www.hosho.io/
[parity]: https://www.parity.io/
[metamask]: https://metamask.io/
[geth]: https://geth.ethereum.org
[npm]: https://www.npmjs.com/
[make]: https://en.wikipedia.org/wiki/Make_(software)
[python 3]: https://www.python.org/
[truffle framework]: http://truffleframework.com/
[mythril]: https://github.com/ConsenSys/mythril
[solium]: https://www.getsolium.com/
[virtualenv]: https://docs.python.org/3/library/venv.html
[blog post]: https://blog.unchained-capital.com/a-simple-safe-multisig-ethereum-smart-contract-for-hardware-wallets-a107bd90bb52
[chrome parity extension]: https://chrome.google.com/webstore/detail/parity-ethereum-integrati/himekenlppkgeaoeddcliojfddemadig
[mist does not support trezor]: https://www.reddit.com/r/TREZOR/comments/6u5r4j/integration_with_ethereum_mist/
[metamask file]: https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#globe_with_meridians-https---web-server-required
