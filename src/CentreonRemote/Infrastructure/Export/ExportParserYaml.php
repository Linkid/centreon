<?php
namespace CentreonRemote\Infrastructure\Export;

use CentreonRemote\Infrastructure\Export\ExportParserInterface;
use Symfony\Component\Yaml\Yaml;

class ExportParserYaml implements ExportParserInterface
{

    public static function parse(string $filename): array
    {
        if (!file_exists($filename)) {
            return [];
        }

        $value = Yaml::parseFile($filename);

        return $value;
    }

    public static function dump(array $input, string $filename): void
    {
        if (!$input) {
            return;
        }

        $yaml = Yaml::dump($input);

        file_put_contents($filename, $yaml);
    }
}
