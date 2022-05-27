# cardknox-sdk-js

## SDK

### HTTPS

To enable _https_ on the Pax device, please contact [support](mailto:support@cardkox.com).

To avoid the need for a self-signed certificate, Cardknox provides a SSL certificate pointing to the local IP address. The format for the host name is \<ip-{IP address replacing the periods with dashes}-mylocaldevice.com\> i.e. for IP address 192.168.1.1 the host name would be _ip-192-168-1-1-mylocaldevice.com_. The SDK will automatically format the host name correctly when the protocol is _https_.

A DNS entry must exist, mapping the host name to the IP address. The SDK will check that the entry exists if there are network errors.

As of today, 5/27/22, we have a way to create a new DNS record. This can be done using our web tool [here](http://localdevice.us-west-2.elasticbeanstalk.com/). This can also be done via API 

```
curl --request POST \
  --url http://localdevice.us-west-2.elasticbeanstalk.com/api/dnsrecord/save \
  --header 'Content-Type: multipart/form-data' \
  --form ip=192.168.1.1
```

### Process

##### Process a transaction

<table>
    <tr>
        <th></th>
        <th>Args</th>
        <th>Returns</th>
    </tr>
    <tr>
        <th>Type</th>
        <td>TransactionRequest</td>
        <td>TransactionResponse</td>
    </tr>
</table>

---

### Get Signature

##### Prompts for signature on the device

This returns a base64 encoded PNG *without the data header*.

<table>
    <tr>
        <th></th>
        <th>Args</th>
        <th>Returns</th>
    </tr>
    <tr>
        <th>Type</th>
        <td>Settings</td>
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
        <td>Transaction amount.</td>
        <td>Format: #.##</td>
    </tr>
    <tr>
        <td>xTip</td>
        <td>Number</td>
        <td>Tip amount included in the transaction amount.</td>
        <td>Format: #.##</td>
    </tr>
    <tr>
        <td>xInvoice</td>
        <td>String</td>
        <td>Invoice number</td>
        <td></td>
    </tr>
    <tr>
        <td>xCustom02</td>
        <td>String</td>
        <td>Custom data</td>
        <td>Max length of 4 (will be truncated)</td>
    </tr>
    <tr>
        <td>xAllowDuplicate</td>
        <td>Boolean</td>
        <td>If true, host will not check for duplicate</td>
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
    <tr>
        <td>deviceIpAddress</td>
        <td>String</td>
        <td>IP address of your device. When the protocol is <em>https</em> the <em>mylocaldevice.com</em> domain name will be used. See <a href="#HTTPS">HTTPS</a></td>
        <td></td>
    </tr>
    <tr>
        <td>deviceIpPort</td>
        <td>String</td>
        <td>IP port of your device. Default is "10009"</td>
        <td></td>
    </tr>
    <tr>
        <td>deviceIpProtocol</td>
        <td>String</td>
        <td>The protocol to use to talk to the device. Defaults to the <em>location</em> protocol</td>
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
