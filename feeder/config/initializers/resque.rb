require 'log4r'
require 'log4r/yamlconfigurator'
require 'log4r/outputter/datefileoutputter'

Dir["#{Rails.root}/app/jobs/*.rb"].each { |r| require r }

Log4r::YamlConfigurator.load_yaml_file("#{Dir.pwd}/config/log4r.yml")
FeedsHelper.log = Log4r::Logger["Feeder"]
EntriesHelper.log = Log4r::Logger["Feeder Mechanized"]

Resque.logger.formatter = Resque::VerboseFormatter.new
