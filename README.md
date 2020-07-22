# cardknox-sdk-js

## SDK

### Process

##### Process a transaction

<table>
    <tr>
        <th>Args</th>
        <td>request</td>
        <td>TransactionRequest</td>
    </tr>
    <tr>
        <th>Returns</th>
        <td>response</td>
        <td>TransactionResponse</td>
    </tr>
</table>

---

### Get Signature

##### Prompts for signature on the device

This returns a base64 encoded PNG *without the data header*.

<table>
    <tr>
        <th>Args</th>
        <td>request</td>
        <td>Settings</td>
    </tr>
    <tr>
        <th>Returns</th>
        <td>signature</td>
        <td>String</td>
    </tr>
</table>

---

### TransactionRequest

<table>
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
        <th>Valid values</th>
    </tr>
    <tr>
        <td>xKey</td>
        <td>String</td>
        <td>Your Cardknox sale-only key</td>
        <td></td>
    </tr>
    <tr>
        <td>xVersion</td>
        <td>String</td>
        <td>Cardknox Gateway version <br> Latest: <code>4.5.8</code></td>
        <td></td>
    </tr>
    <tr>
        <td>xSoftwareName</td>
        <td>String</td>
        <td>Your software name</td>
        <td></td>
    </tr>
    <tr>
        <td>xSoftwareVersion</td>
        <td>String</td>
        <td>Your software version</td>
        <td></td>
    </tr>
    <tr>
        <td>xCommand</td>
        <td>String</td>
        <td>Transaction type</td>
        <td>Enum xCommand</td>
    </tr>
    <tr>
        <td>xAmount</td>
        <td>Number</td>
        <td>Transaction amount</td>
        <td></td>
    </tr>
    <tr>
        <td>settings</td>
        <td>Settings</td>
        <td>Transaction settings, these should be the same for all transactions</td>
        <td></td>
    </tr>
</table>
</table>

---

### Settings

<table>
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
        <th>Valid values</th>
    </tr>
    <!-- <tr>
        <td>deviceName</td>
        <td>String</td>
        <td>Name of your device. Only Pax devices are supported</td>
        <td></td>
    </tr> -->
    <tr>
        <td>deviceIpAddress</td>
        <td>String</td>
        <td>IP address of your device</td>
        <td></td>
    </tr>
    <tr>
        <td>deviceIpPort</td>
        <td>String</td>
        <td>IP port of your device. Default is "10009"</td>
        <td></td>
    </tr>
    <tr>
        <td>deviceSerialNumber</td>
        <td>String</td>
        <td>Device serial number. Required <strong>if</strong> deviceIpAddress is not provided</td>
        <td></td>
    </tr>
</table>

---

### xCommand

List of supported transaction types.

These enums are available from the SDK.

<table>
    <tr>
        <th>Name</th>
        <th>Command</th>
    </tr>
    <tr>
        <td>CC_SALE</td>
        <td>cc:sale</td>
    </tr>
    <tr>
        <td>CC_CREDIT</td>
        <td>cc:credit</td>
    </tr>
    <tr>
        <td>CC_AUTHONLY</td>
        <td>cc:authonly</td>
    </tr>
    <tr>
        <td>CC_CAPTURE</td>
        <td>cc:capture</td>
    </tr>
    <tr>
        <td>CC_POSTAUTH</td>
        <td>cc:postauth</td>
    </tr>
    <tr>
        <td>CC_VOID</td>
        <td>cc:void</td>
    </tr>
    <tr>
        <td>CC_VOIDRELEASE</td>
        <td>cc:voidrelease</td>
    </tr>
    <tr>
        <td>CC_VOIDREFUND</td>
        <td>cc:voidrefund</td>
    </tr>
    <tr>
        <td>CC_BALANCE</td>
        <td>cc:balance</td>
    </tr>
    <tr>
        <td>EBTFS_SALE</td>
        <td>ebtfs:sale</td>
    </tr>
    <tr>
        <td>EBTFS_CREDIT</td>
        <td>ebtfs:credit</td>
    </tr>
    <tr>
        <td>EBTFS_BALANCE</td>
        <td>ebtfs:balance</td>
    </tr>
    <tr>
        <td>EBTCB_SALE</td>
        <td>ebtcb:sale</td>
    </tr>
    <tr>
        <td>EBTCB_BALANCE</td>
        <td>ebtcb:balance</td>
    </tr>
    <tr>
        <td>GIFT_REDEEM</td>
        <td>gift:redeem</td>
    </tr>
    <tr>
        <td>GIFT_ISSUE</td>
        <td>gift:issue</td>
    </tr>
    <tr>
        <td>GIFT_BALANCE</td>
        <td>gift:balance</td>
    </tr>
</table>
