module TagsHelper

  mattr_accessor :log

  def self.add(name)
    if Tag.find_by(name: name).nil?
      @tag = Tag.new
      @tag.name = name

      if @tag.save
        @tag
      end
    end
  end

end  