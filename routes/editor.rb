get '/editor' do
  @game = YAML.load_file(File.join(File.dirname(__FILE__), '..', 'public', 'game_data', 'hmm.yaml'))
  haml :editor, :locals => {:game => @game}, :layout => :editor_layout
end