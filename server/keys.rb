#!/usr/bin/ruby

require 'cgi'

cgi = CGI.new
puts cgi.header
keys = [
]
randIndex = rand(keys.length)
puts keys[randIndex]

time = Time.now.utc
fileTime = time.strftime("%Y-%m-%d")
logTime = time.strftime("%Y-%m-%d %H:%M:%S %Z")
open("/tmp/log-%s.txt" % fileTime, 'a') { |f|
	f.puts "[%s] key -> %s" % [logTime, keys[randIndex]]
}

