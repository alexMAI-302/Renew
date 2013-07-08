# encoding: utf-8
# Drop this file in config/initializers to run your Rails project on Ruby 1.9.
# This is three separate monkey patches -- see comments in code below for the source of each. 
# None of them are original to me, I just put them in one file for easily dropping into my Rails projects.
# Also see original sources for pros and cons of each patch. Most notably, the MySQL patch just assumes
# that everything in your database is stored as UTF-8. This was true for me, and there's a good chance it's
# true for you too, in which case this is a quick, practical solution to get you up and running on Ruby  1.9.
#
# Andre Lewis 1/2010

if Gem::Version.new(''+RUBY_VERSION) >= Gem::Version.new("1.9.0")

  class Integer
    def Integer.word100(num)
        res = ""

        case num
            when 1
                res = "сто"
            when 2
                res = "двести"
            when 3
                res = "триста"
            when 4
                res = "четыреста"
            when 5
                res = "пятьсот"
            when 6
                res = "шестьсот"
            when 7
                res = "семьсот"
            when 8
                res = "восемьсот"
            when 9
                res = "девятьсот"
            when 0
                res = ""
        end

        res
    end
 
    def Integer.word10(num, num2)
        res = ""

        case num
            when 1
                case num2
                    when 0
                        res = "десять"
                    when 1
                        res = "одиннадцать"
                    when 2
                        res = "двенадцать"
                    when 3
                        res = "тринадцать"
                    when 4
                        res = "четырнадцать"
                    when 5
                        res = "пятнадцать"
                    when 6
                        res = "шестнадцать"
                    when 7
                        res = "семнадцать"
                    when 8
                        res = "восемнадцать"
                    when 9
                        res = "девятнадцать"
                end
            when 2
                res = "двадцать"
            when 3
                res = "тридцать"
            when 4
                res = "сорок"
            when 5
                res = "пятьдесят"
            when 6
                res = "шестьдесят"
            when 7
                res = "семьдесят"
            when 8
                res = "восемьдесят"
            when 9
                res = "девяносто"
            when 0
                res = ""
        end

        res
    end

    def Integer.word1(num, digtype)
        res = ""

        case num
            when 1
                if digtype == 2
                    res = "одна"
                else
                    res = "один"
                end
            when 2
                if digtype == 2
                    res = "две"
                else
                    res = "два"
                end
            when 3
                res = "три"
            when 4
                res = "четыре"
            when 5
                res = "пять"
            when 6
                res = "шесть"
            when 7
                res = "семь"
            when 8
                res = "восемь"
            when 9
                res = "девять"
            when 0
                res = ""
        end

        res
    end
    
    def Integer.worddig(num, digtype, normparm)
        res = ""

        case digtype
            when 2
                if normparm == 0
                    res = "тысяч"
                else
                    case num
                        when 1
                            res = "тысяча"
                        when 2..4
                            res = "тысячи"
                        when 5..9, 0
                            res = "тысяч"
                    end
                end
            when 3
                if normparm == 0
                    res = "миллионов"
                else
                    case num
                        when 1
                            res = "миллион"
                        when 2..4
                            res = "миллиона"
                        when 5..9, 0
                            res = "миллионов"
                    end
                end
            when 4
                if normparm == 0
                    res = "миллиардов"
                else
                    case num
                        when 1
                            res = "миллиард"
                        when 2..4
                            res = "миллиарда"
                        when 5..9, 0
                            res = "миллиардов"
                    end
                end
            when 5
                if normparm == 0
                    res = "триллионов"
                else
                    case num
                        when 1
                            res = "триллион"
                        when 2..4
                            res = "триллиона"
                        when 5..9, 0
                            res = "триллионов"
                    end
                end
        end
        res
    end
    
    def Integer.to_human_str(num)
      num.to_i.to_human_str
    end
    
    def to_human_str
        res = ""
        respart = ""
        kus = 0
        inum = self
        div_res = nil
        1.upto(10) do |digtype|
          respart = ""
          if inum > 0
            div_res = inum.divmod(1000)
            kus = div_res[1]
            inum = div_res[0]
            if kus > 0 || digtype == 1
              div_res = kus.divmod(100)
              respart = Integer.word100(div_res[0])
              kus = div_res[1]
              div_res = kus.divmod(10)
              respart = "#{respart} #{Integer.word10(div_res[0], div_res[1])}" 
              if !(kus >= 10 && kus < 20)
                respart = "#{respart} #{Integer.word1(div_res[1], digtype)}"
                respart = "#{respart} #{Integer.worddig(div_res[1], digtype, 1)}"
              else
                respart = "#{respart} #{Integer.worddig(div_res[1], digtype, 0)}"
              end
            end
          else
            break
          end
          res = respart.strip + " " + res.strip
        end

        res
    end

  end

  #
  # Source: https://rails.lighthouseapp.com/projects/8994/tickets/2188-i18n-fails-with-multibyte-strings-in-ruby-19-similar-to-2038
  # (fix_params.rb)

  module ActionController
    class Request
      private

        # Convert nested Hashs to HashWithIndifferentAccess and replace
        # file upload hashs with UploadedFile objects
        def normalize_parameters(value)
          case value
          when Hash
            if value.has_key?(:tempfile)
              upload = value[:tempfile]
              upload.extend(UploadedFile)
              upload.original_path = value[:filename].force_encoding(Encoding::UTF_8)
              upload.content_type = value[:type]
              upload
            else
              h = {}
              value.each { |k, v| h[k] = normalize_parameters(v) }
              h.with_indifferent_access
            end
          when Array
            value.map { |e| normalize_parameters(e) }
          else
            value.force_encoding(Encoding::UTF_8) if value.respond_to?(:force_encoding)
            value
          end
        end
    end
  end


  #
  # Source: https://rails.lighthouseapp.com/projects/8994/tickets/2188-i18n-fails-with-multibyte-strings-in-ruby-19-similar-to-2038
  # (fix_renderable.rb)
  #
  module ActionView
    module Renderable #:nodoc:
      private
        def compile!(render_symbol, local_assigns)
          locals_code = local_assigns.keys.map { |key| "#{key} = local_assigns[:#{key}];" }.join

          source = <<-end_src
            def #{render_symbol}(local_assigns)
              old_output_buffer = output_buffer;#{locals_code};#{compiled_source}
            ensure
              self.output_buffer = old_output_buffer
            end
          end_src
          source.force_encoding(Encoding::UTF_8) if source.respond_to?(:force_encoding)

          begin
            ActionView::Base::CompiledTemplates.module_eval(source, filename, 0)
          rescue Errno::ENOENT => e
            raise e # Missing template file, re-raise for Base to rescue
          rescue Exception => e # errors from template code
            if logger = defined?(ActionController) && Base.logger
              logger.debug "ERROR: compiling #{render_symbol} RAISED #{e}"
              logger.debug "Function body: #{source}"
              logger.debug "Backtrace: #{e.backtrace.join("\n")}"
            end

            raise ActionView::TemplateError.new(self, {}, e)
          end
        end
    end
  end
end
