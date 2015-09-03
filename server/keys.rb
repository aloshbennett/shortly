#!/usr/bin/ruby

require 'cgi'

cgi = CGI.new
puts cgi.header
keys = [
]
expiry = 7*24*3600*1000
randIndex = rand(keys.length)
key = keys[randIndex]
puts "{\"key\": \"#{key}\", \"expiry\": #{expiry}}"

time = Time.now.utc
fileTime = time.strftime("%Y-%m-%d")
logTime = time.strftime("%Y-%m-%d %H:%M:%S %Z")
open("/tmp/log-%s.txt" % fileTime, 'a') { |f|
	f.puts "[%s] key -> %s" % [logTime, keys[randIndex]]
}

