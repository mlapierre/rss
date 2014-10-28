require_relative '../../lib/feeder/feeder'

desc 'Import inoreader.xml'
task :import_opml => :environment do
  Feeder.import_opml_from("spec/fixtures/inoreader.xml")
end