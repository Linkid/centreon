<?php

namespace CentreonRemote\Domain\Service\ConfigurationWizard;

class RemoteConnectionConfigurationService extends ServerConnectionConfigurationService
{

    protected function insertConfigCentreonBroker($serverID)
    {
        $configCentreonBrokerData = $this->getResource('cfg_centreonbroker.php');
        $configCentreonBrokerData = $configCentreonBrokerData($serverID, $this->name);
        $configCentreonBrokerInfoData = $this->getResource('cfg_centreonbroker_info.php');
        $configCentreonBrokerInfoData = $configCentreonBrokerInfoData($this->name, $this->dbUser, $this->dbPassword);

        $this->brokerID = $this->insertWithAdapter('cfg_centreonbroker', $configCentreonBrokerData['broker']);
        $moduleID = $this->insertWithAdapter('cfg_centreonbroker', $configCentreonBrokerData['module']);
        $rrdID = $this->insertWithAdapter('cfg_centreonbroker', $configCentreonBrokerData['rrd']);

        foreach ($configCentreonBrokerInfoData['central-broker'] as $brokerConfig => $brokerData) {
            foreach ($brokerData as $row) {
                if ($brokerConfig == 'output_forward' && $row['config_key'] == 'host') {
                    $row['config_value'] = $this->centralIp;
                }

                $row['config_id'] = $this->brokerID;
                $this->insertWithAdapter('cfg_centreonbroker_info', $row);
            }
        }

        foreach ($configCentreonBrokerInfoData['central-module'] as $brokerConfig => $brokerData) {
            foreach ($brokerData as $row) {
                $row['config_id'] = $moduleID;
                $this->insertWithAdapter('cfg_centreonbroker_info', $row);
            }
        }

        foreach ($configCentreonBrokerInfoData['central-rrd'] as $brokerConfig => $brokerData) {
            foreach ($brokerData as $row) {
                $row['config_id'] = $rrdID;
                $this->insertWithAdapter('cfg_centreonbroker_info', $row);
            }
        }
    }
}
