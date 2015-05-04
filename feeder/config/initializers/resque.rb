require 'log4r'
require 'log4r/yamlconfigurator'
require 'log4r/outputter/datefileoutputter'

#Dir['app/jobs/*.rb'].each { |r| import r }
Dir['app/jobs/*.rb'].each { |r| require "#{Dir.pwd}/#{r}" }

Log4r::YamlConfigurator.load_yaml_file("#{Dir.pwd}/config/log4r.yml")
FeedsHelper.log = Log4r::Logger["Feeder"]
EntriesHelper.log = Log4r::Logger["Feeder Mechanized"]

Resque.logger.formatter = Resque::VerboseFormatter.new
