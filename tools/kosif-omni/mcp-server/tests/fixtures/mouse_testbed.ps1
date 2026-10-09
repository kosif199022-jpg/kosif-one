# KOSIF Mouse test bed: a small WinForms window with real UI Automation controls.
# Writes every event to the log file given as the first argument so tests can verify clicks and typing.
param([string]$Log = "$env:TEMP\kosif_mouse_testbed.log", [int]$Seconds = 60)
Add-Type -AssemblyName System.Windows.Forms, System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()
Set-Content -Path $Log -Value "ready" -Encoding utf8
$f = New-Object System.Windows.Forms.Form
$f.Text = "KOSIF Mouse Testbed"; $f.Size = New-Object System.Drawing.Size(520, 300)
$f.StartPosition = "Manual"; $f.Location = New-Object System.Drawing.Point(200, 200); $f.TopMost = $true
$box = New-Object System.Windows.Forms.TextBox
$box.Name = "searchBox"; $box.AccessibleName = "Search box"; $box.Location = New-Object System.Drawing.Point(20, 20)
$box.Size = New-Object System.Drawing.Size(460, 30)
$save = New-Object System.Windows.Forms.Button
$save.Text = "حفظ"; $save.AccessibleName = "حفظ"; $save.Location = New-Object System.Drawing.Point(20, 70); $save.Size = New-Object System.Drawing.Size(140, 40)
$open = New-Object System.Windows.Forms.Button
$open.Text = "Open report"; $open.Location = New-Object System.Drawing.Point(180, 70); $open.Size = New-Object System.Drawing.Size(140, 40)
$send = New-Object System.Windows.Forms.Button
$send.Text = "Send message"; $send.Location = New-Object System.Drawing.Point(340, 70); $send.Size = New-Object System.Drawing.Size(140, 40)
$pwd = New-Object System.Windows.Forms.TextBox
$pwd.AccessibleName = "Password"; $pwd.UseSystemPasswordChar = $true; $pwd.Location = New-Object System.Drawing.Point(20, 130); $pwd.Size = New-Object System.Drawing.Size(460, 30)
$status = New-Object System.Windows.Forms.Label
$status.Text = "idle"; $status.Location = New-Object System.Drawing.Point(20, 180); $status.Size = New-Object System.Drawing.Size(460, 30)
$save.Add_Click({ $status.Text = "saved: " + $box.Text; Add-Content -Path $Log -Value ("save|" + $box.Text) -Encoding utf8 })
$open.Add_Click({ $status.Text = "report opened"; Add-Content -Path $Log -Value "open" -Encoding utf8 })
$send.Add_Click({ $status.Text = "message sent"; Add-Content -Path $Log -Value "send" -Encoding utf8 })
$f.Controls.AddRange(@($box, $save, $open, $send, $pwd, $status))
$t = New-Object System.Windows.Forms.Timer; $t.Interval = $Seconds * 1000; $t.Add_Tick({ $f.Close() }); $t.Start()
$f.Add_Shown({ $f.Activate() })
[void]$f.ShowDialog()
